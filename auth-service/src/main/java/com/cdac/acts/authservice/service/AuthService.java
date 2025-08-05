package com.cdac.acts.authservice.service;

import com.cdac.acts.authservice.dto.*;
import com.cdac.acts.authservice.exception.UserAlreadyExistsException;
import com.cdac.acts.authservice.model.User;
import com.cdac.acts.authservice.repository.UserRepository;
import com.cdac.acts.authservice.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final RestTemplate restTemplate;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil, AuthenticationManager authenticationManager,
                       RestTemplate restTemplate) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.restTemplate = restTemplate;
    }

    public AuthResponse registerUser(RegisterRequest request) {
        Optional<User> existingUser = userRepository.findByPhoneNumber(request.getPhoneNumber());
        if (existingUser.isPresent()) {
            throw new UserAlreadyExistsException("A user with phone number '" + request.getPhoneNumber() + "' already exists.");
        }

        Optional<User> existingUserByEmail = userRepository.findByEmail(request.getEmail());
        if (existingUserByEmail.isPresent()) {
            throw new UserAlreadyExistsException("A user with email '" + request.getEmail() + "' already exists.");
        }

        User user = new User();
        user.setPhoneNumber(request.getPhoneNumber());
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setStatus("active");
        user.setEmailVerified(false);
        user.setKycVerified(false);
        user.setRole("user");

        userRepository.save(user);

        // Call Wallet-Service to create wallet
        CreateWalletRequest walletRequest = new CreateWalletRequest(user.getId());
        System.out.println("Calling wallet-service to create wallet...");
        WalletDto walletDto = restTemplate.postForObject("http://wallet-service/wallets", walletRequest, WalletDto.class);
        System.out.println("Received Wallet ID: " + walletDto.getId());

        String token = jwtUtil.generateToken(user.getId().toString());

        return new AuthResponse(token, "Registration successful.", user.getId(), user.getPhoneNumber(),
                user.getEmail(), user.getName(), user.getStatus(), user.getEmailVerified(),
                user.getKycVerified(), user.getRole(), user.getCreatedAt(),
                walletDto.getId(), walletDto.getBalance());
    }

    public AuthResponse authenticateUser(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getPhoneNumber(), request.getPassword())
        );
        User user = userRepository.findByPhoneNumber(request.getPhoneNumber())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with phone number: " + request.getPhoneNumber()));

        // Call Wallet-Service to get wallet by userId
        WalletDto walletDto = restTemplate.getForObject("http://wallet-service/wallets/user/" + user.getId(), WalletDto.class);

        String token = jwtUtil.generateToken(user.getId().toString());

        return new AuthResponse(token, "Login successful.", user.getId(), user.getPhoneNumber(),
                user.getEmail(), user.getName(), user.getStatus(), user.getEmailVerified(),
                user.getKycVerified(), user.getRole(), user.getCreatedAt(),
                walletDto.getId(), walletDto.getBalance());
    }
}
