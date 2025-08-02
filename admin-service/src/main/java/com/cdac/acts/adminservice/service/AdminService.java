package com.cdac.acts.adminservice.service;

import com.cdac.acts.adminservice.DTO.UserDTO;
import com.cdac.acts.adminservice.entity.User;

import java.util.List;
import java.util.UUID;

public interface AdminService {
    List<User> getAllUsers();
    UserDTO getUserDetails(UUID userId);
    void suspendUser(UUID userId);
}

