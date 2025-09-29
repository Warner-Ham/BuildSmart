package com.example.buildsmart.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.buildsmart.model.Project;
import com.example.buildsmart.repository.ProjectRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ConstructionController {

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping("/api/projects")
    public List<Project> getProjects() {
        return projectRepository.findAll();
    }
}
