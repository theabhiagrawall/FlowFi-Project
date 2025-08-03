package com.cdac.acts.transactionservice.controller;

import com.cdac.acts.transactionservice.dto.TransactionRequest;
import com.cdac.acts.transactionservice.dto.TransactionResponse;
import com.cdac.acts.transactionservice.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    /**
     * Endpoint to create a new transaction.
     * Corresponds to the "Send Money" screen in the UI.
     */
    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @RequestBody TransactionRequest transactionRequest) {

        TransactionResponse response = transactionService.createTransaction(
                transactionRequest,
                transactionRequest.getFromWalletId()); // <-- GET ID FROM REQUEST

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Endpoint to get all transactions for a specific wallet.
     * Corresponds to the "All Transactions" / "Recent Activity" screens.
     */
    @GetMapping("/wallet/{walletId}")
    public ResponseEntity<List<TransactionResponse>> getTransactionsForWallet(@PathVariable UUID walletId) {
        List<TransactionResponse> transactions = transactionService.getTransactionsByWalletId(walletId);
        return ResponseEntity.ok(transactions);
    }
}