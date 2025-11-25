package com.example.portfolio.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "skills")
public class Skill {
    @Id
    private String id;
    private String name;
    private Integer proficiency; // 0-100
}
