package com.cdac.acts.walletservice.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TransactionRequest {
     @NotNull
    private UUID userId;

     @NotNull
     @Positive
    private BigDecimal amount;

    // future if  transaction logic becomes more complex, e.g.:
    // private String description;
}