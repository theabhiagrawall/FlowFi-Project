package com.cdac.acts.transactionservice.service;

import com.cdac.acts.transactionservice.dto.TransactionRequest;
import com.cdac.acts.transactionservice.dto.TransactionResponse;
import java.util.List;
import java.util.UUID;

public interface TransactionService {
    /**
     * Creates a new transaction between two wallets.
     * @param transactionRequest The request DTO containing transaction details.
     * @param fromWalletId The wallet ID of the user initiating the transaction.
     * @return A DTO of the completed transaction.
     */
    TransactionResponse createTransaction(TransactionRequest transactionRequest, UUID fromWalletId);

    /**
     * Retrieves the transaction history for a specific wallet.
     * @param walletId The ID of the wallet.
     * @return A list of transaction DTOs.
     */
    List<TransactionResponse> getTransactionsByWalletId(UUID walletId);
}