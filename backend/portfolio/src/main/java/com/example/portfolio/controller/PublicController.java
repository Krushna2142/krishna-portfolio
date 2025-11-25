package com.example.portfolio.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.portfolio.entity.ContactMessage;
import com.example.portfolio.entity.Project;
import com.example.portfolio.entity.Skill;
import com.example.portfolio.repository.ProjectRepository;
import com.example.portfolio.repository.SkillRepository;
import com.example.portfolio.service.EmailService;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final ProjectRepository projectRepo;
    private final SkillRepository skillRepo;
    private final EmailService emailService;

    public PublicController(ProjectRepository projectRepo, SkillRepository skillRepo, EmailService emailService) {
        this.projectRepo = projectRepo;
        this.skillRepo = skillRepo;
        this.emailService = emailService;
    }

    @GetMapping("/projects")
    public List<Project> getProjects() { return projectRepo.findAll(); }

    @GetMapping("/skills")
    public List<Skill> getSkills() { return skillRepo.findAll(); }

    @PostMapping("/contact")
    public ContactMessage contact(@RequestBody ContactMessage message) {
        // change the toEmail to your email address
        return emailService.saveAndSend(message, "krushnapokharkar4@gmail.com");
    }
}
