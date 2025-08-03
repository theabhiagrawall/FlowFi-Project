package com.cdac.acts.authservice.service;

import com.cdac.acts.authservice.dto.AuthRequest;
import com.cdac.acts.authservice.dto.AuthResponse;
import com.cdac.acts.authservice.dto.RegisterRequest;
import com.cdac.acts.authservice.model.User;
import com.cdac.acts.authservice.repository.UserRepository;
import com.cdac.acts.authservice.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse registerUser(RegisterRequest request) {
        Optional<User> existingUser = userRepository.findByPhoneNumber(request.getPhoneNumber());
        if (existingUser.isPresent()) {
            return new AuthResponse(null, "User already exists with this phone number.");
        }

        User user = new User();
        user.setPhoneNumber(request.getPhoneNumber());
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setStatus("active");
        user.setEmailVerified(false);
        user.setKycVerified(false);

        userRepository.save(user);


        String token = jwtUtil.generateToken(user.getId().toString());
        return new AuthResponse(token, "Registration successful.");
    }

    public AuthResponse authenticateUser(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getPhoneNumber(), request.getPassword())
        );

        User user = userRepository.findByPhoneNumber(request.getPhoneNumber())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getId().toString());
        return new AuthResponse(token, "Login successful.");
    }
}
