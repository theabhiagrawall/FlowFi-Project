package com.cdac.acts.authservice.controller;

import com.cdac.acts.authservice.dto.AuthRequest;
import com.cdac.acts.authservice.dto.AuthResponse;
import com.cdac.acts.authservice.dto.RegisterRequest;
import com.cdac.acts.authservice.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.registerUser(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticateUser(request));
    }
}
