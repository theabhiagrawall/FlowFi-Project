package com.cdac.acts.walletservice.service;

import com.cdac.acts.walletservice.dto.WalletDto;
import com.cdac.acts.walletservice.entity.Wallet;
import com.cdac.acts.walletservice.repository.WalletRepository;
import com.cdac.acts.walletservice.exception.*; // Import all custom exceptions
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

// future addition
//Add transaction history retrieval.
//Add a method to “freeze” or “lock” wallets.
//Add pagination for wallet listing (for admin dashboard).

@Service
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;

    // Constructor Injection
    public WalletServiceImpl(WalletRepository walletRepository) {
        this.walletRepository = walletRepository;
    }

    // Helper to convert the Entity to DTO
    private WalletDto toWalletDto(Wallet wallet) {
        if (wallet == null) {
            return null; // Or throw an exception if a null Wallet entity is unexpected here
        }
        return new WalletDto(wallet.getId(), wallet.getUserId(), wallet.getBalance(), wallet.getUpdatedAt());
    }

    @Override
    @Transactional
    public WalletDto createWallet(UUID userId) {
        // Check if a wallet already exists
        Optional<Wallet> existingWallet = walletRepository.findByUserId(userId);
        if (existingWallet.isPresent()) {
            // custom exception: WalletCreationException
            throw new WalletCreationException("Wallet already exists for user ID: " + userId);
        }

        Wallet wallet = new Wallet();
        wallet.setUserId(userId);
        wallet.setBalance(BigDecimal.ZERO); // New wallets start with zero balance Using as to avoid hardcoding and inconsistency
        wallet.setUpdatedAt(LocalDateTime.now()); // Set initial update timestamp which will be created at

        Wallet savedWallet = walletRepository.save(wallet);
        return toWalletDto(savedWallet);
    }

    @Override
    public WalletDto getWalletById(UUID walletId) {
        // Use orElseThrow with custom exception
        return walletRepository.findById(walletId)
                .map(this::toWalletDto)
                .orElseThrow(() -> new WalletNotFoundException("Wallet with ID " + walletId + " not found."));
    }

    @Override
    public WalletDto getWalletByUserId(UUID userId) {
        return walletRepository.findByUserId(userId)
                .map(this::toWalletDto)
                .orElseThrow(() -> new WalletNotFoundException("Wallet for user ID " + userId + " not found."));
    }

    @Override
    @Transactional
    public WalletDto creditWallet(UUID userId, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidAmountException("Credit amount must be positive.");
        }

        // Find wallet by user ID, throw WalletNotFoundException if not found
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new WalletNotFoundException("Wallet not found for user ID: " + userId));

        wallet.setBalance(wallet.getBalance().add(amount));
        wallet.setUpdatedAt(LocalDateTime.now()); // Update timestamp

        Wallet updatedWallet = walletRepository.save(wallet);
        return toWalletDto(updatedWallet);
    }

    @Override
    @Transactional
    public WalletDto debitWallet(UUID userId, BigDecimal amount) {
        // Validate amount using custom exception
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidAmountException("Debit amount must be positive.");
        }

        // Find wallet by user ID, throw WalletNotFoundException if not found
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new WalletNotFoundException("Wallet not found for user ID: " + userId));

        // Check for insufficient balance using custom exception
        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException("Insufficient funds in wallet for user ID: " + userId + ". Available: " + wallet.getBalance() + ", Requested: " + amount);
        }

        wallet.setBalance(wallet.getBalance().subtract(amount));
        wallet.setUpdatedAt(LocalDateTime.now()); // Update timestamp

        Wallet updatedWallet = walletRepository.save(wallet);
        return toWalletDto(updatedWallet);
    }

    @Override
    @Transactional
    public void deleteWallet(UUID walletId) {
        if (!walletRepository.existsById(walletId)) {
            throw new WalletNotFoundException("Wallet with ID " + walletId + " not found for deletion.");
        }
        walletRepository.deleteById(walletId);
    }

    @Override
    public BigDecimal getBalance(UUID userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new WalletNotFoundException("Wallet not found for user ID: " + userId));
        return wallet.getBalance();
    }
}