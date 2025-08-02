package com.cdac.acts.walletservice.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Value;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for {@link com.cdac.acts.walletservice.entity.Wallet}
 */
@Value
public class WalletDto implements Serializable {

    @NotNull(message = "Wallet ID cannot be null")
    UUID id;

    @NotNull(message = "User ID cannot be null")
    UUID userId;

    @NotNull(message = "Balance cannot be null")
    @DecimalMin(value = "0.0", inclusive = true, message = "Balance cannot be negative")
    BigDecimal balance;

    @NotNull(message = "updatedAt timestamp is required")
    LocalDateTime updatedAt;
}