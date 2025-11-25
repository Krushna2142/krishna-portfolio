package com.example.portfolio.service;

import org.springframework.stereotype.Service;
import com.example.portfolio.repository.ProjectRepository;
import com.example.portfolio.entity.Project;
import com.example.portfolio.exception.ResourceNotFoundException;

import java.util.List;

@Service
public class ProjectService {
    private final ProjectRepository repo;
    public ProjectService(ProjectRepository repo) { this.repo = repo; }

    public List<Project> getAll() { return repo.findAll(); }
    public Project getById(String id) { return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Project not found")); }
    public Project create(Project p) { return repo.save(p); }
    public Project update(String id, Project p) {
        Project ex = getById(id);
        ex.setTitle(p.getTitle());
        ex.setDescription(p.getDescription());
        ex.setTechStack(p.getTechStack());
        ex.setLink(p.getLink());
        ex.setImageUrl(p.getImageUrl());
        return repo.save(ex);
    }
    public void delete(String id) { repo.deleteById(id); }
}
