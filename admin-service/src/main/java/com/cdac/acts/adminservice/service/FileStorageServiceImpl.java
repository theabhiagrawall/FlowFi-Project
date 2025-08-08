package com.cdac.acts.adminservice.service;

import com.cdac.acts.adminservice.entity.KycInfo;
import com.cdac.acts.adminservice.entity.User;
import com.cdac.acts.adminservice.repository.KycInfoRepository;
import com.cdac.acts.adminservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final UserRepository userRepository;
    private final KycInfoRepository kycInfoRepository;

    @Value("${kyc.documents.folder:src/main/resources/static/kyc-docs}")
    private String kycDocsFolder;

    public FileStorageServiceImpl(UserRepository userRepository,
                                  KycInfoRepository kycInfoRepository) {
        this.userRepository = userRepository;
        this.kycInfoRepository = kycInfoRepository;
    }

    @Override
    public String storeKycDocument(UUID userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String fileName = StringUtils.cleanPath(userId + "_" + file.getOriginalFilename());
        Path targetLocation = Paths.get(kycDocsFolder).toAbsolutePath().normalize().resolve(fileName);
        System.out.println("Resolved file path: " + targetLocation.toString());


        try {
            Files.createDirectories(targetLocation.getParent());
            Files.copy(file.getInputStream(), targetLocation);

            Optional<KycInfo> kycInfoOpt = kycInfoRepository.findByUserId(userId);
            KycInfo kycInfo = kycInfoOpt.orElseGet(KycInfo::new);

            kycInfo.setUser(user);
            kycInfo.setDocumentPath("/kyc-docs/" + fileName);

            kycInfoRepository.save(kycInfo);

            return "KYC Document uploaded successfully.";
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }
    @Override
    public ResponseEntity<Resource> getKycDocument(UUID userId) {
        KycInfo kycInfo = kycInfoRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("KYC Info not found for user"));

        String documentPath = kycInfo.getDocumentPath();
        Path filePath = Paths.get(kycDocsFolder).resolve(Paths.get(documentPath).getFileName()).normalize();

        try {
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists()) {
                throw new RuntimeException("File not found " + documentPath);
            }

            String contentType = Files.probeContentType(filePath);

            if (contentType == null) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE; // This is a generic "binary file" type
            }
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType)) // Use the detected type
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (Exception ex) {
            throw new RuntimeException("Could not read file: " + documentPath, ex);
        }
    }
}
