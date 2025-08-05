package com.cdac.acts.authservice.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class AuthResponse {

    private String token;
    private String message;
    private UUID id;
    private String phoneNumber;
    private String email;
    private String name;
    private String status;
    private Boolean emailVerified;
    private Boolean kycVerified;
    private String role;
    private LocalDateTime createdAt;
    private UUID walletId;
    private BigDecimal walletBalance;

    // Constructor
    public AuthResponse(String token, String message, UUID id, String phoneNumber, String email,
                        String name, String status, Boolean emailVerified, Boolean kycVerified,
                        String role, LocalDateTime createdAt, UUID walletId, BigDecimal walletBalance) {
        this.token = token;
        this.message = message;
        this.id = id;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.name = name;
        this.status = status;
        this.emailVerified = emailVerified;
        this.kycVerified = kycVerified;
        this.role = role;
        this.createdAt = createdAt;
        this.walletId = walletId;
        this.walletBalance = walletBalance;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getEmailVerified() { return emailVerified; }
    public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }

    public Boolean getKycVerified() { return kycVerified; }
    public void setKycVerified(Boolean kycVerified) { this.kycVerified = kycVerified; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public UUID getWalletId() { return walletId; }
    public void setWalletId(UUID walletId) { this.walletId = walletId; }

    public BigDecimal getWalletBalance() { return walletBalance; }
    public void setWalletBalance(BigDecimal walletBalance) { this.walletBalance = walletBalance; }
}
