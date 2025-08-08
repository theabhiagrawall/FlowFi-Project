// File: com/cdac/acts/adminservice/repository/KycInfoRepository.java

package com.cdac.acts.adminservice.repository;

import com.cdac.acts.adminservice.entity.KycInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface KycInfoRepository extends JpaRepository<KycInfo, UUID> {
    Optional<KycInfo> findByUserId(UUID userId);

    @Modifying // Marks the query as a data modification language (DML) query
    @Transactional // Ensures the operation runs in a transaction
    @Query("DELETE FROM KycInfo k WHERE k.user.id = ?1")
    void deleteByUserId(UUID userId);
}