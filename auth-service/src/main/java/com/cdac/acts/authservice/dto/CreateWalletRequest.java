package com.cdac.acts.authservice.dto;

import java.util.UUID;

public class CreateWalletRequest {
    private UUID userId;

    public CreateWalletRequest() {
    }

    public CreateWalletRequest(UUID userId) {
        this.userId = userId;
    }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
}
