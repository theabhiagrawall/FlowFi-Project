package com.cdac.acts.userservice.service;

import com.cdac.acts.userservice.dto.KycInfoRequest;
import com.cdac.acts.userservice.dto.UpdateUserRequest;
import com.cdac.acts.userservice.dto.UserResponse;
import com.cdac.acts.userservice.exception.DuplicateEmailException;
import com.cdac.acts.userservice.exception.DuplicatePhoneNumberException;
import com.cdac.acts.userservice.model.KycInfo;
import com.cdac.acts.userservice.model.User;
import com.cdac.acts.userservice.repository.KycInfoRepository;
import com.cdac.acts.userservice.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final KycInfoRepository kycInfoRepository;

    public UserService(UserRepository userRepository, KycInfoRepository kycInfoRepository) {
        this.userRepository = userRepository;
        this.kycInfoRepository = kycInfoRepository;
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

    public String addOrUpdateKycInfo(UUID userId, KycInfoRequest dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<KycInfo> existingKyc = kycInfoRepository.findByUserId(userId);
        KycInfo kyc = existingKyc.orElseGet(KycInfo::new);

        kyc.setUser(user);
        kyc.setPanNumber(dto.getPanNumber());

        // ✅ Corrected logic: check if the Aadhaar number has text
        if (StringUtils.hasText(dto.getAadhaarNumber())) {
            kyc.setAadhaarNumber(dto.getAadhaarNumber());
        } else {
            // ✅ If the field is empty, explicitly set it to null
            kyc.setAadhaarNumber(null);
        }

        kyc.setVerified(dto.isVerified());
        kycInfoRepository.save(kyc);

        // Sync with users table
        user.setKycVerified(dto.isVerified());
        userRepository.save(user);

        return existingKyc.isPresent() ? "KYC info updated successfully." : "KYC info added successfully.";
    }

    public boolean deleteUser(UUID id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return true;
        }).orElse(false);
    }

    public List<UserResponse> searchUsersByEmailPrefix(String prefix, UUID excludeUserId) {
        return userRepository.searchUsersByEmailPrefix(prefix).stream()
                .filter(user -> !user.getId().equals(excludeUserId))
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
