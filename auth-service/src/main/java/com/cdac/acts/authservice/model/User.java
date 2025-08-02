package com.cdac.acts.authservice.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    private String name;

//    @Column
//    private String password; // Plain text or masked (optional)

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column
    private String status;

    @Column(name = "email_verified")
    private boolean emailVerified;

    @Column(name = "kyc_verified")
    private boolean kycVerified;

    @Column(name = "created_at")
    private String createdAt;

    @PrePersist
    public void prePersist() {
        this.id = UUID.randomUUID();
        this.createdAt = java.time.LocalDateTime.now().toString();
    }

    // Constructors
    public User() {}

    public User(String phoneNumber, String email, String name,
                String passwordHash, String status, boolean emailVerified,
                boolean kycVerified, String createdAt) {
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.name = name;
        this.passwordHash = passwordHash;
        this.status = status;
        this.emailVerified = emailVerified;
        this.kycVerified = kycVerified;
        this.createdAt = createdAt;
    }

    // Getters and Setters

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

//    public String getPassword() {
//        return password;
//    }
//
//    public void setPassword(String password) {
//        this.password = password;
//    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
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

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
