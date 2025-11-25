package com.example.portfolio.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "contacts")
public class ContactMessage {
    @Id
    private String id;
    private String name;
    private String email;
    private String message;
    private Instant sentAt = Instant.now();
}
