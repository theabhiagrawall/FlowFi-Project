package com.cdac.acts.adminservice.service;

import com.cdac.acts.adminservice.dto.KycInfoRequest;
import com.cdac.acts.adminservice.dto.UpdateUserRequest;
import com.cdac.acts.adminservice.dto.UserDTO;
import com.cdac.acts.adminservice.entity.KycInfo;
import com.cdac.acts.adminservice.entity.User;

import java.util.List;
import java.util.UUID;

public interface AdminService {
    List<User> getAllUsers(); // From Admin DB
    UserDTO getUserById(UUID id); // From user-service
    void deleteUser(UUID id); // From user-service

    String addOrUpdateKycInfo(UUID userId, KycInfoRequest dto);
    void updateUserByAdmin(UUID userId, UpdateUserRequest request);
}
