package com.cdac.acts.userservice.service;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface FileStorageService {
    String storeKycDocument(UUID userId, MultipartFile file);
    ResponseEntity<Resource> getKycDocument(UUID userId);
}
