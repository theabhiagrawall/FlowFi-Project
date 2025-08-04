package com.cdac.acts.transactionservice.service;

import com.cdac.acts.transactionservice.entity.Transaction;
import com.cdac.acts.transactionservice.enums.TransactionStatus;
import com.cdac.acts.transactionservice.enums.TransactionType;
import org.springframework.data.jpa.domain.Specification;
import java.time.LocalDate;
import java.util.UUID;

public class TransactionSpecification {

    public static Specification<Transaction> hasWalletId(UUID walletId) {
        return (root, query, cb) -> cb.or(
                cb.equal(root.get("fromWalletId"), walletId),
                cb.equal(root.get("toWalletId"), walletId)
        );
    }

    public static Specification<Transaction> hasType(TransactionType type) {
        return (root, query, cb) -> type == null ? cb.conjunction() : cb.equal(root.get("type"), type);
    }

    public static Specification<Transaction> hasStatus(TransactionStatus status) {
        return (root, query, cb) -> status == null ? cb.conjunction() : cb.equal(root.get("status"), status);
    }

    public static Specification<Transaction> isBetweenDates(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            return (root, query, cb) -> cb.conjunction();
        }
        return (root, query, cb) -> cb.between(root.get("createdAt").as(LocalDate.class), startDate, endDate);
    }
}