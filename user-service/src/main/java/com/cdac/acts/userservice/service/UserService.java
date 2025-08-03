package com.cdac.acts.userservice.service;

import com.cdac.acts.userservice.dto.UpdateUserRequest;
import com.cdac.acts.userservice.dto.UserResponse;
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
            if (updateRequest.getPhoneNumber() != null) {
                user.setPhoneNumber(updateRequest.getPhoneNumber());
            }
            if (updateRequest.getEmail() != null) {
                user.setEmail(updateRequest.getEmail());
            }
            if (updateRequest.getName() != null) {
                user.setName(updateRequest.getName());
            }
            if (updateRequest.getStatus() != null) {
                user.setStatus(updateRequest.getStatus());
            }
            if (updateRequest.getEmailVerified() != null) {
                user.setEmailVerified(updateRequest.getEmailVerified());
            }
            if (updateRequest.getKycVerified() != null) {
                user.setKycVerified(updateRequest.getKycVerified());
            }
            if (updateRequest.getRole() != null) {
                user.setRole(updateRequest.getRole());
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
