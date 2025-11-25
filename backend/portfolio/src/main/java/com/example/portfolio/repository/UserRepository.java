package com.example.portfolio.repository;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.portfolio.entity.AppUser;

public interface UserRepository extends MongoRepository<AppUser, String> {
    Optional<AppUser> findByUsername(String username);
}
