package com.cdac.acts.adminservice.service;

import com.cdac.acts.adminservice.DTO.UserDTO;
import com.cdac.acts.adminservice.entity.User;
import com.cdac.acts.adminservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.cdac.acts.adminservice.exception.UserServiceException;

import java.util.List;
import java.util.UUID;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestTemplate restTemplate;

    private final String USER_SERVICE_URL = "http://localhost:8081/api/users";

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public UserDTO getUserDetails(UUID userId) {
        try {
            return restTemplate.getForObject(USER_SERVICE_URL + "/" + userId, UserDTO.class);
        } catch (Exception e) {
            throw new UserServiceException("User details could not be fetched: " + e.getMessage());
        }
    }

    @Override
    public void suspendUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserServiceException("User not found"));
        user.setStatus("inactive");
        userRepository.save(user);
    }
}
