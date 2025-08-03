package com.cdac.acts.adminservice.service;

import com.cdac.acts.adminservice.dto.UserDTO;
import com.cdac.acts.adminservice.entity.User;

import java.util.List;
import java.util.UUID;

public interface AdminService {
    List<User> getAllUsers(); // From Admin DB
    UserDTO getUserById(UUID id); // From user-service
    void deleteUser(UUID id); // From user-service
}
