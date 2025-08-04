package com.cdac.acts.adminservice.controller;

import com.cdac.acts.adminservice.dto.KycInfoRequest;
import com.cdac.acts.adminservice.dto.UpdateUserRequest;
import com.cdac.acts.adminservice.dto.UserDTO;
import com.cdac.acts.adminservice.entity.KycInfo;
import com.cdac.acts.adminservice.entity.User;
import com.cdac.acts.adminservice.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDTO> getUserDetails(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.getUserById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser(@PathVariable UUID id, @RequestBody UpdateUserRequest request) {
        adminService.updateUserDetails(id, request);
        return ResponseEntity.ok("User updated successfully");
    }


    @PostMapping("/kyc/{userId}")
    public String addOrUpdateKyc(@PathVariable UUID userId, @RequestBody KycInfoRequest request) {
        return adminService.addOrUpdateKycInfo(userId, request);
    }


    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> suspendUser(@PathVariable UUID id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
