package com.cdac.acts.transactionservice.repository;

import com.cdac.acts.transactionservice.entity.Transaction;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID>,
        JpaSpecificationExecutor<Transaction> {

    interface FrequentContactProjection {
        UUID getOtherWalletId();
        Long getTransactionCount();
    }

    @Query(value =
            "SELECT other_wallet_id as otherWalletId, COUNT(*) as transactionCount " +
                    "FROM (" +
                    "    SELECT to_wallet_id as other_wallet_id FROM transactions WHERE from_wallet_id = :walletId AND type = 'TRANSFER'" +
                    "    UNION ALL" +
                    "    SELECT from_wallet_id as other_wallet_id FROM transactions WHERE to_wallet_id = :walletId AND type = 'TRANSFER'" +
                    ") as all_contacts " +
                    "WHERE other_wallet_id != '00000000-0000-0000-0000-000000000001' " +
                    "GROUP BY other_wallet_id " +
                    "ORDER BY transactionCount DESC",
            nativeQuery = true)
    List<FrequentContactProjection> findFrequentContactsByWalletId(@Param("walletId") UUID walletId, Pageable pageable);

    @Query("SELECT " +
            "COALESCE(SUM(CASE WHEN t.toWalletId = :walletId THEN t.amount ELSE 0 END), 0) as incoming, " +
            "COALESCE(SUM(CASE WHEN t.fromWalletId = :walletId THEN t.amount ELSE 0 END), 0) as outgoing " +
            "FROM Transaction t " +
            "WHERE (t.toWalletId = :walletId OR t.fromWalletId = :walletId) " +
            "AND t.status = 'SUCCESS' " +
            "AND FUNCTION('DATE_TRUNC', 'month', t.createdAt) = FUNCTION('DATE_TRUNC', 'month', CURRENT_DATE)")
    Map<String, BigDecimal> findCurrentMonthTotals(@Param("walletId") UUID walletId);

    @Query(value = "SELECT " +
            "COALESCE(SUM(CASE WHEN t.to_wallet_id = :walletId THEN t.amount ELSE 0 END), 0) as incoming, " +
            "COALESCE(SUM(CASE WHEN t.from_wallet_id = :walletId THEN t.amount ELSE 0 END), 0) as outgoing " +
            "FROM transactions t " +
            "WHERE (t.to_wallet_id = :walletId OR t.from_wallet_id = :walletId) " +
            "AND t.status = 'SUCCESS' " +
            "AND DATE_TRUNC('month', t.created_at) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')",
            nativeQuery = true)
    Map<String, BigDecimal> findPreviousMonthTotals(@Param("walletId") UUID walletId);


    @Query(value = "SELECT " +
            "TO_CHAR(month_series, 'Mon') as month, " +
            "COALESCE(SUM(CASE WHEN t.to_wallet_id = :walletId THEN t.amount ELSE 0 END), 0) as received, " +
            "COALESCE(SUM(CASE WHEN t.from_wallet_id = :walletId THEN t.amount ELSE 0 END), 0) as sent " +
            "FROM generate_series(DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '6 months', DATE_TRUNC('month', CURRENT_DATE), '1 month') as month_series " +
            "LEFT JOIN transactions t ON DATE_TRUNC('month', t.created_at) = month_series AND (t.to_wallet_id = :walletId OR t.from_wallet_id = :walletId) AND t.status = 'SUCCESS' " +
            "GROUP BY month_series " +
            "ORDER BY month_series", nativeQuery = true)
    List<Map<String, Object>> findMonthlyOverview(@Param("walletId") UUID walletId);

    @Query("SELECT t.category as category, SUM(t.amount) as amount " +
            "FROM Transaction t " +
            "WHERE t.fromWalletId = :walletId AND t.status = 'SUCCESS' AND t.type != 'WITHDRAWAL' " +
            "GROUP BY t.category " +
            "ORDER BY amount DESC")
    List<Map<String, Object>> findSpendingByCategory(@Param("walletId") UUID walletId);
}