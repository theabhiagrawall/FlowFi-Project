package com.cdac.acts.userservice.service;

import com.cdac.acts.userservice.dto.UpdateUserRequest;
import com.cdac.acts.userservice.dto.UserResponse;
import com.cdac.acts.userservice.exception.DuplicateEmailException;
import com.cdac.acts.userservice.exception.DuplicatePhoneNumberException;
import com.cdac.acts.userservice.model.User;
import com.cdac.acts.userservice.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<UserResponse> findUserById(UUID id) {
        return userRepository.findById(id).map(this::mapToUserResponse);
    }

    public Optional<UserResponse> findUserByEmail(String email) {
        return userRepository.findByEmail(email).map(this::mapToUserResponse);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    public Optional<UserResponse> updateUser(UUID id, UpdateUserRequest updateRequest) {
        return userRepository.findById(id).map(user -> {

            // Check for duplicate email if it's being updated
            if (updateRequest.getEmail() != null && !updateRequest.getEmail().equals(user.getEmail())) {
                userRepository.findByEmail(updateRequest.getEmail())
                        .filter(existingUser -> !existingUser.getId().equals(id))
                        .ifPresent(existingUser -> {
                            throw new DuplicateEmailException("Email already exists!");
                        });
                user.setEmail(updateRequest.getEmail());
            }

            // Check for duplicate phone number if it's being updated
            if (updateRequest.getPhoneNumber() != null && !updateRequest.getPhoneNumber().equals(user.getPhoneNumber())) {
                userRepository.findByPhoneNumber(updateRequest.getPhoneNumber())
                        .filter(existingUser -> !existingUser.getId().equals(id))
                        .ifPresent(existingUser -> {
                            throw new DuplicatePhoneNumberException("Phone number already exists!");
                        });
                user.setPhoneNumber(updateRequest.getPhoneNumber());
            }

            // Update name if provided
            if (updateRequest.getName() != null) {
                user.setName(updateRequest.getName());
            }

            userRepository.save(user);
            return mapToUserResponse(user);
        });
    }

    public boolean deleteUser(UUID id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return true;
        }).orElse(false);
    }

    public List<UserResponse> searchUsersByEmailPrefix(String prefix) {
        return userRepository.searchUsersByEmailPrefix(prefix).stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setStatus(user.getStatus());
        response.setEmailVerified(user.getEmailVerified());
        response.setKycVerified(user.getKycVerified());
        response.setRole(user.getRole());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}
