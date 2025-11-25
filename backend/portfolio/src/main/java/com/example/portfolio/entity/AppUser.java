package com.example.portfolio.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class AppUser {
    @Id
    private String id;
    private String username;
    private String password; // hashed
    private String role; // e.g. ROLE_ADMIN
}
