package com.cdac.acts.adminservice.repository;

import com.cdac.acts.adminservice.entity.User; // The User entity class you'll create
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findById(UUID id);
}