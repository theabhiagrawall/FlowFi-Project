package com.cdac.acts.authservice.service;

import com.cdac.acts.authservice.dto.AuthRequest;
import com.cdac.acts.authservice.dto.AuthResponse;
import com.cdac.acts.authservice.dto.RegisterRequest;
import com.cdac.acts.authservice.exception.UserAlreadyExistsException;
import com.cdac.acts.authservice.model.User;
import com.cdac.acts.authservice.repository.UserRepository;
import com.cdac.acts.authservice.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthService(UserRepository userRepository,
                       JwtUtil jwtUtil,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse registerUser(RegisterRequest request) {
        Optional<User> existingUser = userRepository.findByPhoneNumber(request.getPhoneNumber());

        if (existingUser.isPresent()) {
            throw new UserAlreadyExistsException("User already exists with phone number: " + request.getPhoneNumber());
        }

        User newUser = new User();
        newUser.setPhoneNumber(request.getPhoneNumber());
        newUser.setEmail(request.getEmail());
        newUser.setName(request.getName());
        //newUser.setPassword(request.getPassword()); // optional: store plain password temporarily (not recommended in production)
        newUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        newUser.setStatus("ACTIVE");
        newUser.setEmailVerified(false);
        newUser.setKycVerified(false);

        userRepository.save(newUser);

        String token = jwtUtil.generateToken(newUser.getId().toString(),newUser.getPhoneNumber());

        return new AuthResponse(token, "User registered successfully.");
    }

    public AuthResponse authenticateUser(AuthRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getPhoneNumber(), request.getPassword())
            );

            // Fetch the user from DB after successful authentication
            Optional<User> userOptional = userRepository.findByPhoneNumber(request.getPhoneNumber());
            if (userOptional.isEmpty()) {
                return new AuthResponse(null, "Authentication failed: User not found.");
            }

            User user = userOptional.get();

            String token = jwtUtil.generateToken(user.getId().toString(), user.getPhoneNumber());

            return new AuthResponse(token, "Authentication successful.");
        } catch (AuthenticationException e) {
            return new AuthResponse(null, "Authentication failed: " + e.getMessage());
        }
    }

}
