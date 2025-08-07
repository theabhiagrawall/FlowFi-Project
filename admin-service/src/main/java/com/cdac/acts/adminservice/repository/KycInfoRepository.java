package com.cdac.acts.adminservice.repository;

import com.cdac.acts.adminservice.entity.KycInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface KycInfoRepository extends JpaRepository<KycInfo, UUID> {
    Optional<KycInfo> findByUserId(UUID userId);
    void deleteByUserId(UUID userId);
}
