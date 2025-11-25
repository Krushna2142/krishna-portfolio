package com.example.portfolio.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.portfolio.entity.ContactMessage;
import com.example.portfolio.repository.ContactMessageRepository;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private final ContactMessageRepository repo;

    public EmailService(JavaMailSender mailSender, ContactMessageRepository repo) {
        this.mailSender = mailSender;
        this.repo = repo;
    }

    public ContactMessage saveAndSend(ContactMessage message, String toEmail) {
        ContactMessage saved = repo.save(message);
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(toEmail);
            mail.setSubject("New contact from: " + message.getName());
            mail.setText("From: " + message.getEmail() + "\n\n" + message.getMessage());
            mailSender.send(mail);
        } catch (Exception e) {
            // log but still return saved message
            System.err.println("Failed to send mail: " + e.getMessage());
        }
        return saved;
    }
}
