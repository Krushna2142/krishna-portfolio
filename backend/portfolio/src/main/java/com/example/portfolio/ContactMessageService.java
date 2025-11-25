package com.example.portfolio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.portfolio.entity.ContactMessage;
import com.example.portfolio.repository.ContactMessageRepository;

@Service
public class ContactMessageService {

    @Autowired
    private ContactMessageRepository repository;

    public ContactMessage saveMessage(ContactMessage message) {
        return repository.save(message);
    }
}
