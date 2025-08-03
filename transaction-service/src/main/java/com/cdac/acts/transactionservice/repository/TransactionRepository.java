package com.cdac.acts.transactionservice.repository;

import com.cdac.acts.transactionservice.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    /**
     * Finds all transactions where the given walletId is either the sender (fromWalletId)
     * or the receiver (toWalletId). This is  for fetching a user's complete
     * transaction history. Results are ordered by the most recent first.
     *  so that we can limit to show the recent transactions.
     */
    @Query("SELECT t FROM Transaction t WHERE t.fromWalletId = :walletId OR t.toWalletId = :walletId ORDER BY t.createdAt DESC")
    List<Transaction> findTransactionsByWalletId(@Param("walletId") UUID walletId);

}