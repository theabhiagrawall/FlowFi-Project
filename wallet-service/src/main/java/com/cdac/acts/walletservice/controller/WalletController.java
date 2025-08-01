package com.cdac.acts.walletservice.controller;

import com.cdac.acts.walletservice.dto.CreateWalletRequest;
import com.cdac.acts.walletservice.dto.WalletDto;
import com.cdac.acts.walletservice.dto.TransactionRequest;
import com.cdac.acts.walletservice.service.WalletService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/wallets")
public class WalletController {

    private final WalletService walletService;

    // Constructor Injection
    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }


    @PostMapping
    public ResponseEntity<WalletDto> createWallet(@RequestBody CreateWalletRequest request) {
        WalletDto wallet = walletService.createWallet(request.getUserId());
        return new ResponseEntity<>(wallet, HttpStatus.CREATED);
    }

    @GetMapping("/{walletId}")
    public ResponseEntity<WalletDto> getWalletById(@PathVariable UUID walletId) {
        WalletDto wallet = walletService.getWalletById(walletId);
        return ResponseEntity.ok(wallet);
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<WalletDto> getWalletByUserId(@PathVariable UUID userId) {
        WalletDto wallet = walletService.getWalletByUserId(userId);
        return ResponseEntity.ok(wallet);
    }


    @PostMapping("/credit")
    public ResponseEntity<WalletDto> creditWallet(@RequestBody TransactionRequest request) {
        WalletDto updatedWallet = walletService.creditWallet(request.getUserId(), request.getAmount());
        return ResponseEntity.ok(updatedWallet);
    }

    @PostMapping("/debit")
    public ResponseEntity<WalletDto> debitWallet(@RequestBody TransactionRequest request) {
        WalletDto updatedWallet = walletService.debitWallet(request.getUserId(), request.getAmount());
        return ResponseEntity.ok(updatedWallet);
    }


    @GetMapping("/balance/{userId}")
    public ResponseEntity<BigDecimal> getBalance(@PathVariable UUID userId) {
        BigDecimal balance = walletService.getBalance(userId);
        return ResponseEntity.ok(balance);
    }

    @DeleteMapping("/{walletId}")
    public ResponseEntity<Void> deleteWallet(@PathVariable UUID walletId) {
        walletService.deleteWallet(walletId);
        return ResponseEntity.noContent().build();
    }
}