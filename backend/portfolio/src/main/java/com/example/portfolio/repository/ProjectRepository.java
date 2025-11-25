package com.example.portfolio.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.portfolio.entity.Project;

public interface ProjectRepository extends MongoRepository<Project, String> {}
