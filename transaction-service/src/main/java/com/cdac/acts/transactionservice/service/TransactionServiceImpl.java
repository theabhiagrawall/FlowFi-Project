package com.cdac.acts.transactionservice.service;

import com.cdac.acts.transactionservice.dto.TransactionRequest;
import com.cdac.acts.transactionservice.dto.TransactionResponse;
import com.cdac.acts.transactionservice.entity.Transaction;
import com.cdac.acts.transactionservice.enums.TransactionStatus;
import com.cdac.acts.transactionservice.enums.TransactionType;
import com.cdac.acts.transactionservice.repository.TransactionRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final RestTemplate restTemplate;

    private final String WALLET_SERVICE_URL = "http://wallet-service/api/wallets";

    @Override
    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request, UUID fromWalletId) {
        // 1. Create and save the initial transaction in a PENDING state
        Transaction transaction = new Transaction();
        transaction.setFromWalletId(fromWalletId);
        transaction.setToWalletId(request.getToWalletId());
        transaction.setAmount(request.getAmount());
        transaction.setDescription(request.getDescription());
        transaction.setCategory(request.getCategory());
        transaction.setType(TransactionType.TRANSFER);
        transaction.setStatus(TransactionStatus.PENDING);

        Transaction savedTransaction = transactionRepository.save(transaction);

        try {
            // 2. Perform the debit and credit operations by calling the wallet service
            restTemplate.postForObject(WALLET_SERVICE_URL + "/debit-by-wallet",
                    new WalletUpdateRequest(fromWalletId, request.getAmount()), Void.class);

            restTemplate.postForObject(WALLET_SERVICE_URL + "/credit-by-wallet",
                    new WalletUpdateRequest(request.getToWalletId(), request.getAmount()), Void.class);

            // 3. If both succeed, update the transaction status to SUCCESS
            savedTransaction.setStatus(TransactionStatus.SUCCESS);
        } catch (Exception e) {
            // 4. If any operation fails, update status to FAILED
            // In a real-world scenario, you would also implement a compensation action.
            // For example, if credit fails after debit succeeded, you must refund the debit.
            savedTransaction.setStatus(TransactionStatus.FAILED);
        }

        // 5. Save the final transaction status and return the response
        Transaction finalTransaction = transactionRepository.save(savedTransaction);
        return mapToResponse(finalTransaction);
    }

    @Override
    public List<TransactionResponse> getTransactionsByWalletId(UUID walletId) {
        return transactionRepository.findTransactionsByWalletId(walletId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // A helper method to map the Entity to a Response DTO
    private TransactionResponse mapToResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getFromWalletId(),
                transaction.getToWalletId(),
                transaction.getAmount(),
                transaction.getType(),
                transaction.getStatus(),
                transaction.getCategory(),
                transaction.getDescription(),
                transaction.getCreatedAt()
        );
    }

    // A private static class to represent the request body for the wallet service
    @Data
    @AllArgsConstructor
    private static class WalletUpdateRequest {
        private UUID walletId;
        private BigDecimal amount;
    }
}