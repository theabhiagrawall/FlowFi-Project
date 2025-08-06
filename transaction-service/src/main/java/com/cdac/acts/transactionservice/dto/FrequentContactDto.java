package com.cdac.acts.transactionservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FrequentContactDto {
    private UUID userId;
    private String name;
    private String avatar; // Can be null
    private Long transactionCount;
}