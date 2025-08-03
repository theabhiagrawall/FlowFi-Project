package com.cdac.acts.adminservice.repository;

import com.cdac.acts.adminservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
}
