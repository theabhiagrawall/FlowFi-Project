package com.cdac.acts.transactionservice.service;

import com.cdac.acts.transactionservice.dto.TransactionRequest;
import com.cdac.acts.transactionservice.dto.TransactionResponse;
import com.cdac.acts.transactionservice.enums.TransactionStatus;
import com.cdac.acts.transactionservice.enums.TransactionType;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public interface TransactionService {

    public TransactionResponse createTransaction(TransactionRequest request);
    //  flexible filtering
    List<TransactionResponse> getTransactions(UUID walletId, TransactionType type, TransactionStatus status, LocalDate startDate, LocalDate endDate);

    //  get a single transaction by its ID
    Optional<TransactionResponse> getTransactionById(UUID transactionId);

    //  getting transactions by userId (calls wallet-service)
    List<TransactionResponse> getTransactionsByUserId(UUID userId);

    //  soft-deleting a transaction
    void deleteTransaction(UUID transactionId);
}