package com.cdac.acts.userservice.controller;

import com.cdac.acts.userservice.dto.KycInfoRequest;
import com.cdac.acts.userservice.dto.UpdateUserRequest;
import com.cdac.acts.userservice.dto.UserResponse;
import com.cdac.acts.userservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        Optional<UserResponse> user = userService.findUserById(id);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email) {
        Optional<UserResponse> user = userService.findUserByEmail(email);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable UUID id, @RequestBody UpdateUserRequest request) {
        Optional<UserResponse> updatedUser = userService.updateUser(id, request);
        return updatedUser.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        boolean deleted = userService.deleteUser(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchUsersByEmailPrefix(@RequestParam String email) {
        List<UserResponse> users = userService.searchUsersByEmailPrefix(email);
        return ResponseEntity.ok(users);
    }

    @PostMapping("/kyc/{id}")
    public ResponseEntity<String> addOrUpdateKyc(
            @PathVariable("id") UUID userId,
            @RequestBody KycInfoRequest kycInfoRequest) {
        String response = userService.addOrUpdateKycInfo(userId, kycInfoRequest);
        return ResponseEntity.ok(response);
    }
}
