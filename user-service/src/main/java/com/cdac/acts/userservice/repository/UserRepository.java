package com.cdac.acts.userservice.repository;

import com.cdac.acts.userservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findById(UUID id);

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE LOWER(SUBSTRING(u.email, 1, LOCATE('@', u.email)-1)) LIKE LOWER(CONCAT(:prefix, '%'))")
    List<User> searchUsersByEmailPrefix(@Param("prefix") String prefix);
}
