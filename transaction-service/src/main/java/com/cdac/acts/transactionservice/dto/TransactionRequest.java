package com.cdac.acts.transactionservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequest {
    private UUID fromWalletId;
    private UUID toWalletId;
    private BigDecimal amount;
    private String category;
    private String description;
}