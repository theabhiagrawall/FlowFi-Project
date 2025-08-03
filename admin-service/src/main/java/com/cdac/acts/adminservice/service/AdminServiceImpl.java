package com.cdac.acts.adminservice.service;

import com.cdac.acts.adminservice.dto.UserDTO;
import com.cdac.acts.adminservice.entity.User;
import com.cdac.acts.adminservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.UUID;

@Service
public class AdminServiceImpl implements AdminService {

    private final RestTemplate restTemplate;
    private final UserRepository userRepository;

    // Base URL of the user-service registered in Eureka
    @Value("${user.service.name:user-service}")
    private String userServiceName;


    public AdminServiceImpl(RestTemplate restTemplate, UserRepository userRepository) {
        this.restTemplate = restTemplate;
        this.userRepository = userRepository;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public UserDTO getUserById(UUID id) {
        String url = "http://" + userServiceName + "/users/" + id;
        return restTemplate.getForObject(url, UserDTO.class);
    }

    @Override
    public void deleteUser(UUID id) {
        String url = "http://" + userServiceName + "/users/" + id;
        restTemplate.delete(url);
    }
}
