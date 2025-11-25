package com.example.portfolio.controller;

import com.example.portfolio.config.JwtUtils;
import com.example.portfolio.model.User;
import com.example.portfolio.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepo.findByUsername(request.getUsername()).orElseThrow();
        String token = jwtUtils.generateToken(user.getUsername(), user.getRole());

        return ResponseEntity.ok(new AuthResponse(token));
    }

    @Data
    static class AuthRequest {
        private String username;
        private String password;
    }

    @Data
    @AllArgsConstructor
    static class AuthResponse {
        private String token;
    }
}
