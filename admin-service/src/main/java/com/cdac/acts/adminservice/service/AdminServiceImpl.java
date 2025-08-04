package com.cdac.acts.adminservice.service;

import com.cdac.acts.adminservice.dto.KycInfoRequest;
import com.cdac.acts.adminservice.dto.UpdateUserRequest;
import com.cdac.acts.adminservice.dto.UserDTO;
import com.cdac.acts.adminservice.entity.KycInfo;
import com.cdac.acts.adminservice.entity.Role;
import com.cdac.acts.adminservice.entity.Status;
import com.cdac.acts.adminservice.entity.User;
import com.cdac.acts.adminservice.exception.UserNotFoundException;
import com.cdac.acts.adminservice.repository.KycInfoRepository;
import com.cdac.acts.adminservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AdminServiceImpl implements AdminService {

    private final RestTemplate restTemplate;
    private final UserRepository userRepository;
    private final KycInfoRepository kycInfoRepository;

    @Value("${user.service.name}")
    private String userServiceName;

    @Value("${user.service.route}")
    private String userServiceRoute;

    public AdminServiceImpl(RestTemplate restTemplate,
                            UserRepository userRepository,
                            KycInfoRepository kycInfoRepository) {
        this.restTemplate = restTemplate;
        this.userRepository = userRepository;
        this.kycInfoRepository = kycInfoRepository;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public UserDTO getUserById(UUID id) {
        String url = "http://" + userServiceName + "/" + userServiceRoute + "/users/" + id;
        return restTemplate.getForObject(url, UserDTO.class);
    }

    @Override
    public void deleteUser(UUID id) {
        String url = "http://" + userServiceName + "/" + userServiceRoute + "/users/" + id;
        restTemplate.delete(url);
    }

    @Override
    public String addOrUpdateKycInfo(UUID userId, KycInfoRequest dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<KycInfo> existingKyc = kycInfoRepository.findByUserId(userId);
        KycInfo kyc = existingKyc.orElseGet(KycInfo::new);

        kyc.setUser(user);
        kyc.setPanNumber(dto.getPanNumber());

        if (dto.getAadhaarNumber() != null) {
            kyc.setAadharNumber(dto.getAadhaarNumber());
        }

        kyc.setVerified(dto.isVerified());
        kycInfoRepository.save(kyc);

        // Sync with users table
        user.setKycVerified(dto.isVerified());
        userRepository.save(user);

        return existingKyc.isPresent() ? "KYC info updated successfully." : "KYC info added successfully.";
    }


    @Override
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
}

