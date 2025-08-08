package com.cdac.acts.adminservice.service;

import com.cdac.acts.adminservice.dto.AdminUserViewDTO;
import com.cdac.acts.adminservice.dto.KycInfoRequest;
import com.cdac.acts.adminservice.dto.UpdateUserRequest;
import com.cdac.acts.adminservice.dto.UserDTO;
import com.cdac.acts.adminservice.entity.*;
import com.cdac.acts.adminservice.exception.UserNotFoundException;
import com.cdac.acts.adminservice.repository.KycInfoRepository;
import com.cdac.acts.adminservice.repository.UserRepository;
import com.cdac.acts.adminservice.repository.WalletRepository;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final KycInfoRepository kycInfoRepository;
    private final WalletRepository  walletRepository;


    public AdminServiceImpl(
                            UserRepository userRepository,
                            KycInfoRepository kycInfoRepository, WalletRepository walletRepository) {
        this.userRepository = userRepository;
        this.kycInfoRepository = kycInfoRepository;
        this.walletRepository = walletRepository;
    }

    @Override
    public List<AdminUserViewDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<AdminUserViewDTO> userDTOs = new ArrayList<>();

        final UUID SYSTEM_USER_ID = UUID.fromString("00000000-0000-0000-0000-000000000000");

        for (User user : users) {
            if (user.getId().equals(SYSTEM_USER_ID)) {
                continue;
            }

            AdminUserViewDTO dto = new AdminUserViewDTO();
            dto.setId(user.getId());
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            dto.setPhoneNumber(user.getPhoneNumber());
            dto.setStatus(user.getStatus().toString());
            dto.setRole(user.getRole().toString());
            dto.setEmailVerified(user.isEmailVerified());

            Optional<KycInfo> kycInfoOpt = kycInfoRepository.findByUserId(user.getId());
            if (user.isKycVerified()) {
                dto.setKycStatus("Verified");
            }
            else {
                dto.setKycStatus("Unverified");
            }

            // ✅ Set the document URL if KYC info exists
            kycInfoOpt.ifPresent(kycInfo -> {
                dto.setKycDocumentUrl(kycInfo.getDocumentPath());
            });

            dto.setCreatedAt(user.getCreatedAt().toLocalDateTime());

            BigDecimal balance = walletRepository.findByUserId(user.getId())
                    .map(Wallet::getBalance)
                    .orElse(BigDecimal.ZERO);

            dto.setWalletBalance(balance);
            userDTOs.add(dto);
        }
        return userDTOs;
    }


    public UserDTO getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ Now this method will convert the populated User object to a DTO
        return convertToDto(user);
    }

    private UserDTO convertToDto(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setStatus(user.getStatus().toString());
        dto.setRole(user.getRole().toString());
        dto.setEmailVerified(user.isEmailVerified());
        dto.setKycVerified(user.isKycVerified());
        dto.setCreatedAt(user.getCreatedAt().toLocalDateTime());

        BigDecimal balance = walletRepository.findByUserId(user.getId())
                .map(Wallet::getBalance)
                .orElse(BigDecimal.ZERO);
        dto.setWalletBalance(balance);

        return dto;
    }

    @Override
    @Transactional
    public void deleteUser(UUID id) {
        // Check if the user exists
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User with ID " + id + " not found."));

        walletRepository.deleteByUserId(id);

        kycInfoRepository.deleteByUserId(id);

        userRepository.deleteById(id);
    }

    @Override
    @Transactional
    public String addOrUpdateKycInfo(UUID userId, KycInfoRequest dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<KycInfo> existingKyc = kycInfoRepository.findByUserId(userId);
        KycInfo kyc = existingKyc.orElseGet(KycInfo::new);

        kyc.setUser(user);
        kyc.setPanNumber(dto.getPanNumber());

        if (dto.getAadhaarNumber() != null) {
            kyc.setAadhaarNumber(dto.getAadhaarNumber());
        }

        kyc.setVerified(dto.isVerified());
        kycInfoRepository.save(kyc);

        // Sync with users table
        user.setKycVerified(dto.isVerified());
        userRepository.save(user);

        return existingKyc.isPresent() ? "KYC info updated successfully." : "KYC info added successfully.";
    }


    @Override
    @Transactional
    public void updateUserByAdmin(UUID userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        // Update user fields
        user.setStatus(Status.valueOf(request.getStatus()));
        user.setRole(Role.valueOf(request.getRole()));
        user.setEmailVerified(request.isEmailVerified());
        user.setKycVerified(request.isKycVerified());

        userRepository.save(user);

        // Also update KYC info table if present
        Optional<KycInfo> kycInfoOpt = kycInfoRepository.findByUserId(userId);
        if (kycInfoOpt.isPresent()) {
            KycInfo kycInfo = kycInfoOpt.get();
            kycInfo.setVerified(request.isKycVerified());
            kycInfoRepository.save(kycInfo);
        }
    }

    @Override
    @Transactional
    public void approveKyc(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Optional<KycInfo> optionalKyc = kycInfoRepository.findByUserId(userId);
        if (optionalKyc.isEmpty()) {
            throw new RuntimeException("KYC info not found for user");
        }

        KycInfo kycInfo = optionalKyc.get();
        kycInfo.setVerified(true);
        kycInfoRepository.save(kycInfo);

        user.setKycVerified(true);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void rejectKyc(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // ✅ Use the new, more reliable delete method
        kycInfoRepository.deleteByUserId(userId);

        // Now, update the user entity's status and save it.
        user.setKycVerified(false);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public boolean getKycVerifiedStatus(UUID userId) {
        return kycInfoRepository.findByUserId(userId)
                .map(KycInfo::isVerified)
                .orElseThrow(() -> new RuntimeException("KYC info not found for user: " + userId));

    }
}

