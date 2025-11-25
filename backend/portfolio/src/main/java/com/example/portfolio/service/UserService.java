package com.example.portfolio.service;

import org.springframework.stereotype.Service;

import com.example.portfolio.entity.AppUser;
import com.example.portfolio.repository.UserRepository;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository repo;

    public UserService(UserRepository repo) { this.repo = repo; }

    public Optional<AppUser> findByUsername(String username) { return repo.findByUsername(username); }

    public AppUser save(AppUser user) { return repo.save(user); }
}
