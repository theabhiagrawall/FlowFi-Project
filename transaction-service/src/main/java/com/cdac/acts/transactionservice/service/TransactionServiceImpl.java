package com.cdac.acts.transactionservice.service;

import com.cdac.acts.transactionservice.dto.TransactionRequest;
import com.cdac.acts.transactionservice.dto.TransactionResponse;
import com.cdac.acts.transactionservice.entity.Transaction;
import com.cdac.acts.transactionservice.enums.TransactionStatus;
import com.cdac.acts.transactionservice.enums.TransactionType;
import com.cdac.acts.transactionservice.exception.TransactionCreationException;
import com.cdac.acts.transactionservice.repository.TransactionRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.cdac.acts.transactionservice.service.TransactionSpecification.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final RestTemplate restTemplate;
    private final String WALLET_SERVICE_URL = "http://wallet-service/api/wallets";
    //for local testing use the local url
    //private final String WALLET_SERVICE_URL = "http://127.0.0.1:8082/wallets";
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request, UUID fromWalletId) {
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
            log.info("Attempting to debit from wallet: {}", fromWalletId);
            restTemplate.postForObject(WALLET_SERVICE_URL + "/debit",
                    new WalletUpdateRequest(fromWalletId, request.getAmount()), Void.class);

            log.info("Debit successful. Attempting to credit wallet: {}", request.getToWalletId());
            restTemplate.postForObject(WALLET_SERVICE_URL + "/credit",
                    new WalletUpdateRequest(request.getToWalletId(), request.getAmount()), Void.class);

            log.info("Credit successful.");
            savedTransaction.setStatus(TransactionStatus.SUCCESS);

        } catch (HttpClientErrorException e) {
            String errorPayload = e.getResponseBodyAsString();
            log.error("HTTP Client Error from wallet service: {}", errorPayload);
            savedTransaction.setStatus(TransactionStatus.FAILED);
            transactionRepository.save(savedTransaction);

            String errorMessage = extractMessageFromJson(errorPayload);
            throw new TransactionCreationException(errorMessage);

        } catch (Exception e) {
            log.error("A non-HTTP error occurred during wallet operation: {}", e.getMessage());
            savedTransaction.setStatus(TransactionStatus.FAILED);
            transactionRepository.save(savedTransaction);
            throw new TransactionCreationException("Could not connect to Wallet Service.");
        }

        Transaction finalTransaction = transactionRepository.save(savedTransaction);
        return mapToResponse(finalTransaction);
    }

    private String extractMessageFromJson(String json) {
        try {
            Map<String, Object> errorMap = objectMapper.readValue(json, Map.class);
            return (String) errorMap.getOrDefault("message", "An error occurred during the transaction.");
        } catch (JsonProcessingException e) {
            return "Failed to parse error response from wallet service.";
        }
    }

    @Override
    public List<TransactionResponse> getTransactions(UUID walletId, TransactionType type, TransactionStatus status, LocalDate startDate, LocalDate endDate) {
        Specification<Transaction> spec = hasWalletId(walletId)
                .and(hasType(type))
                .and(hasStatus(status))
                .and(isBetweenDates(startDate, endDate));

        // The database query already sorts by most recent first, so no need to reverse in code.
        return transactionRepository.findAll(spec)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<TransactionResponse> getTransactionById(UUID transactionId) {
        return transactionRepository.findById(transactionId).map(this::mapToResponse);
    }

    @Override
    public List<TransactionResponse> getTransactionsByUserId(UUID userId) {
        WalletResponse wallet = restTemplate.getForObject(WALLET_SERVICE_URL + "/user/" + userId, WalletResponse.class);

        if (wallet != null && wallet.getId() != null) {
            return getTransactions(wallet.getId(), null, null, null, null);
        }
        return List.of();
    }

    @Override
    public void deleteTransaction(UUID transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found for id: " + transactionId));

        transaction.setStatus(TransactionStatus.CANCELLED);
        transactionRepository.save(transaction);
    }

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

    @Data
    @AllArgsConstructor
    private static class WalletUpdateRequest {
        private UUID walletId;
        private BigDecimal amount;
    }

    @Data
    @AllArgsConstructor
    private static class WalletResponse {
        private UUID id;
        private UUID userId;
        private BigDecimal balance;
    }
}