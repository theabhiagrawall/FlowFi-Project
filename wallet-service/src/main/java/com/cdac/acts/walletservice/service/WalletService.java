package com.cdac.acts.walletservice.service;
import com.cdac.acts.walletservice.dto.WalletDto;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public interface WalletService {
    // Create a wallet for a new user
    WalletDto createWallet(UUID userId);

    // Get wallet by walletId
    WalletDto getWalletById(UUID walletId);

    // Get wallet by userId (since one user has one wallet)
    WalletDto getWalletByUserId(UUID userId);

    // Add money (credit) to wallet
    WalletDto creditWallet(UUID walletId, BigDecimal amount);

    // Deduct money (debit) from wallet
    WalletDto debitWallet(UUID walletId, BigDecimal amount);

    // Delete wallet (optional but keeping it here if needed will add this)
    void deleteWallet(UUID walletId);

    // Check balance
    BigDecimal getBalance(UUID userId);
}
