package com.cdac.acts.walletservice.service;

import com.cdac.acts.walletservice.dto.WalletDto;
import com.cdac.acts.walletservice.entity.Wallet;
import com.cdac.acts.walletservice.repository.WalletRepository;
import com.cdac.acts.walletservice.exception.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private static final Logger logger = LoggerFactory.getLogger(WalletServiceImpl.class);


    public WalletServiceImpl(WalletRepository walletRepository) {
        this.walletRepository = walletRepository;
    }

    private WalletDto toWalletDto(Wallet wallet) {
        if (wallet == null) {
            return null;
        }
        return new WalletDto(wallet.getId(), wallet.getUserId(), wallet.getBalance(), wallet.getUpdatedAt());
    }

    @Override
    @Transactional
    public WalletDto createWallet(UUID userId) {
        if (walletRepository.findByUserId(userId).isPresent()) {
            throw new WalletCreationException("Wallet already exists for user ID: " + userId);
        }
        Wallet wallet = new Wallet();
        wallet.setUserId(userId);
        wallet.setBalance(BigDecimal.ZERO);
        wallet.setUpdatedAt(LocalDateTime.now());
        Wallet savedWallet = walletRepository.save(wallet);
        logger.info("Created new wallet for user ID: {}", userId);
        return toWalletDto(savedWallet);
    }

    @Override
    public WalletDto getWalletById(UUID walletId) {
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
    public WalletDto creditWallet(UUID walletId, BigDecimal amount) {
        logger.info("Crediting wallet {} with amount {}", walletId, amount);
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidAmountException("Credit amount must be positive.");
        }

        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new WalletNotFoundException("Wallet not found for ID: " + walletId));

        wallet.setBalance(wallet.getBalance().add(amount));
        wallet.setUpdatedAt(LocalDateTime.now());

        Wallet updatedWallet = walletRepository.save(wallet);


        return toWalletDto(updatedWallet);
    }

    @Override
    @Transactional
    public WalletDto debitWallet(UUID walletId, BigDecimal amount) {
        logger.info("Debiting wallet {} with amount {}", walletId, amount);
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidAmountException("Debit amount must be positive.");
        }

        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new WalletNotFoundException("Wallet not found for ID: " + walletId));

        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException("Insufficient funds in wallet ID: " + walletId);
        }

        wallet.setBalance(wallet.getBalance().subtract(amount));
        wallet.setUpdatedAt(LocalDateTime.now());

        Wallet updatedWallet = walletRepository.save(wallet);

        return toWalletDto(updatedWallet);
    }

    @Override
    @Transactional
    public void deleteWallet(UUID walletId) {
        if (!walletRepository.existsById(walletId)) {
            throw new WalletNotFoundException("Cannot delete. Wallet with ID " + walletId + " not found.");
        }
        walletRepository.deleteById(walletId);
        logger.info("Deleted wallet with ID: {}", walletId);
    }

    @Override
    public BigDecimal getBalance(UUID userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new WalletNotFoundException("Wallet not found for user ID: " + userId));
        return wallet.getBalance();
    }
}
