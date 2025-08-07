package com.cdac.acts.adminservice.repository;

import com.cdac.acts.adminservice.entity.User;
import com.cdac.acts.adminservice.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, UUID> {
    Optional<Wallet> findByUserId(UUID userId);
    void deleteByUserId(UUID userId);
}

