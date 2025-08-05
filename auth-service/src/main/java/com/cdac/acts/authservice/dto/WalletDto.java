package com.cdac.acts.authservice.dto;

import java.math.BigDecimal;
import java.util.UUID;

public class WalletDto {
    private UUID id;
    private UUID userId;
    private BigDecimal balance;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
}
