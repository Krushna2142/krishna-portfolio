package com.example.portfolio.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.portfolio.entity.ContactMessage;

public interface ContactMessageRepository extends MongoRepository<ContactMessage, String> {}
