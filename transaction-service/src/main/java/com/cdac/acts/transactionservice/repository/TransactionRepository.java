package com.cdac.acts.transactionservice.repository;

import com.cdac.acts.transactionservice.entity.Transaction;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
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
}