package com.cdac.acts.transactionservice.controller;

import com.cdac.acts.transactionservice.dto.FrequentContactDto;
import com.cdac.acts.transactionservice.dto.TransactionRequest;
import com.cdac.acts.transactionservice.dto.TransactionResponse;
import com.cdac.acts.transactionservice.enums.TransactionStatus;
import com.cdac.acts.transactionservice.enums.TransactionType;
import com.cdac.acts.transactionservice.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    /**
     * Creates a new transaction.
     * Sender's wallet ID is temporarily taken from the request body for ease of testing.
     */
    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @Valid @RequestBody TransactionRequest transactionRequest) {
        TransactionResponse response = transactionService.createTransaction(transactionRequest);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Gets all transactions for a specific wallet, with optional filters.
     */
    @GetMapping("/wallet/{walletId}")
    public ResponseEntity<List<TransactionResponse>> getTransactionsForWallet(
            @PathVariable UUID walletId,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) TransactionStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<TransactionResponse> transactions = transactionService.getTransactions(walletId, type, status, startDate, endDate);
        return ResponseEntity.ok(transactions);
    }

    /**
     * Gets all transactions for a user by their user ID.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TransactionResponse>> getTransactionsByUserId(@PathVariable UUID userId) {
        List<TransactionResponse> transactions = transactionService.getTransactionsByUserId(userId);
        return ResponseEntity.ok(transactions);
    }

    /**
     * Fetches a single transaction by its unique ID.
     */
    @GetMapping("/{transactionId}")
    public ResponseEntity<TransactionResponse> getTransactionById(@PathVariable UUID transactionId) {
        return transactionService.getTransactionById(transactionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Soft-deletes a transaction (admin-only).
     */
    @DeleteMapping("/{transactionId}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable UUID transactionId) {
        transactionService.deleteTransaction(transactionId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/frequent-contacts/{walletId}")
    public ResponseEntity<List<FrequentContactDto>> getFrequentContacts(
            @PathVariable UUID walletId,
            @RequestParam(defaultValue = "6") int limit) {

        List<FrequentContactDto> contacts = transactionService.getFrequentContacts(walletId, limit);
        return ResponseEntity.ok(contacts);
    }
}