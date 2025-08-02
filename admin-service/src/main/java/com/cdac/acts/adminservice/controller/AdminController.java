package com.cdac.acts.adminservice.controller;

import com.cdac.acts.adminservice.DTO.UserDTO;
import com.cdac.acts.adminservice.entity.User;
import com.cdac.acts.adminservice.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Show all users for the table (initial screen)
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // Fetch specific user details (on "View Details" click)
    @GetMapping("/user/{userId}")
    public ResponseEntity<UserDTO> getUserDetails(@PathVariable UUID userId) {
        return ResponseEntity.ok(adminService.getUserDetails(userId));
    }

    // Suspend user from your database
    @PostMapping("/suspend/{userId}")
    public ResponseEntity<String> suspendUser(@PathVariable UUID userId) {
        adminService.suspendUser(userId);
        return ResponseEntity.ok("User suspended successfully");
    }
}

