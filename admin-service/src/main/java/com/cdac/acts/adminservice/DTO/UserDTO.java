package com.cdac.acts.adminservice.DTO;

import java.time.LocalDateTime;
import java.util.UUID;

public class UserDTO {
        private UUID id;
        private String phoneNumber;
        private String email;
        private String name;
        private String status;
        private boolean emailVerified;
        private boolean kycVerified;
        private LocalDateTime createdAt;

    // Constructors
    public UserDTO() {}

    public UserDTO(UUID id, String phoneNumber, String email, String name,
                   String status, boolean emailVerified, boolean kycVerified,
                   LocalDateTime createdAt) {
        this.id = id;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.name = name;
        this.status = status;
        this.emailVerified = emailVerified;
        this.kycVerified = kycVerified;
        this.createdAt = createdAt;
    }

    // Getters and setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public boolean isKycVerified() {
        return kycVerified;
    }

    public void setKycVerified(boolean kycVerified) {
        this.kycVerified = kycVerified;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

