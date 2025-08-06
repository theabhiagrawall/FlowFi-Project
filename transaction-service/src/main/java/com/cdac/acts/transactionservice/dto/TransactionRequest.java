package com.cdac.acts.transactionservice.dto;

import com.cdac.acts.transactionservice.enums.TransactionType;
import jakarta.validation.constraints.NotNull;
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

    @NotNull(message = "Destination wallet ID cannot be null for deposits and transfers.")
    private UUID toWalletId;

    @NotNull(message = "Amount cannot be null.")
    private BigDecimal amount;

    private String category;

    private String description;

    @NotNull(message = "Transaction type cannot be null.")
    private TransactionType type;
}
