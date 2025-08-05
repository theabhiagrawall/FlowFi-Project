package com.cdac.acts.adminservice.controller;

import com.cdac.acts.adminservice.service.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/kyc-documents")
public class KycDocumentController {

    private final FileStorageService fileStorageService;

    public KycDocumentController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/upload/{userId}")
    public ResponseEntity<String> uploadKycDocument(@PathVariable UUID userId,
                                                    @RequestParam("file") MultipartFile file) {
        String message = fileStorageService.storeKycDocument(userId, file);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/view/{userId}")
    public ResponseEntity<Resource> viewKycDocument(@PathVariable UUID userId) {
        return fileStorageService.getKycDocument(userId);
    }

}
