package com.example.portfolio.service;

import org.springframework.stereotype.Service;
import com.example.portfolio.repository.SkillRepository;
import com.example.portfolio.entity.Skill;
import com.example.portfolio.exception.ResourceNotFoundException;

import java.util.List;

@Service
public class SkillService {
    private final SkillRepository repo;
    public SkillService(SkillRepository repo) { this.repo = repo; }

    public List<Skill> getAll() { return repo.findAll(); }
    public Skill getById(String id) { return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Skill not found")); }
    public Skill create(Skill s) { return repo.save(s); }
    public Skill update(String id, Skill s) {
        Skill ex = getById(id);
        ex.setName(s.getName());
        ex.setProficiency(s.getProficiency());
        return repo.save(ex);
    }
    public void delete(String id) { repo.deleteById(id); }
}
