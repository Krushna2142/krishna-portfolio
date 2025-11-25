package com.example.portfolio.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.portfolio.entity.Skill;

public interface SkillRepository extends MongoRepository<Skill, String> {}
