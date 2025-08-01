package com.cdac.acts.walletservice.dto;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;

@Getter
@Setter
@ToString
public class CreateWalletRequest {
    private UUID userId;
}