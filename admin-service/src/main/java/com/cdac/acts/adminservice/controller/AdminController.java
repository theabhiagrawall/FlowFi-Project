package com.cdac.acts.adminservice.controller;

import com.cdac.acts.adminservice.dto.AdminUserViewDTO;
import com.cdac.acts.adminservice.dto.KycInfoRequest;
import com.cdac.acts.adminservice.dto.UpdateUserRequest;
import com.cdac.acts.adminservice.dto.UserDTO;
import com.cdac.acts.adminservice.entity.KycInfo;
import com.cdac.acts.adminservice.entity.User;
import com.cdac.acts.adminservice.entity.Wallet;
import com.cdac.acts.adminservice.repository.KycInfoRepository;
import com.cdac.acts.adminservice.repository.WalletRepository;
import com.cdac.acts.adminservice.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    public ResponseEntity<List<AdminUserViewDTO>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDTO> getUserDetails(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.getUserById(id));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<String> updateUserByAdmin(@PathVariable UUID id,
                                                    @RequestBody UpdateUserRequest request) {
        adminService.updateUserByAdmin(id, request);
        return ResponseEntity.ok("User updated successfully.");
    }

    @PostMapping("/kyc/{id}")
    public ResponseEntity<String> addOrUpdateKyc(
            @PathVariable("id") UUID userId,
            @RequestBody KycInfoRequest kycInfoRequest) {
        String response = adminService.addOrUpdateKycInfo(userId, kycInfoRequest);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<String> approveKyc(@PathVariable("id") UUID userId) {
        adminService.approveKyc(userId);
        return ResponseEntity.ok("KYC approved successfully.");
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<String> rejectKyc(@PathVariable("id") UUID userId) {
        adminService.rejectKyc(userId);
        return ResponseEntity.ok("KYC rejected and info deleted.");
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> suspendUser(@PathVariable UUID id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/kyc/status/{userId}")
    public ResponseEntity<Map<String, String>> getKycStatus(@PathVariable UUID userId) {

        boolean status = adminService.getKycVerifiedStatus(userId);

        Map<String, String> response = Map.of("status", String.valueOf(status));

        return ResponseEntity.ok(response);
    }

}
