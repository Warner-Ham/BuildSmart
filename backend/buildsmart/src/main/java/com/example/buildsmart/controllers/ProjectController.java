package com.example.buildsmart.controllers;

import com.example.buildsmart.model.Project;
import com.example.buildsmart.repository.ProjectRepository;
import com.example.buildsmart.services.ProjectService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// inside src/main/java/com/example/buildsmart/ConstructionController or new ProjectController

@RestController
@RequestMapping("/api/staff/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ProjectRepository ProjectRepository;

    // Create a new project from a request
    @PostMapping("/approve/{requestId}")
    public Project approveRequestAndCreateProject(@PathVariable Long requestId, @RequestBody Project projectDetails) {
        // Assume you have a way to get the logged-in staff user
        return projectService.approveRequest(requestId, projectDetails);
    }

    // Read project details
    @GetMapping("/{id}")
    public Project getProject(@PathVariable Long id) {
        return ProjectRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Project not found"));
    }

    // Update project details
    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project updatedProject) {
        Project project = ProjectRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Project not found"));
        // Update fields based on the request body
        project.setName(updatedProject.getName());
        project.setPre_budget(updatedProject.getPre_budget());
        // ... and so on
        return ProjectRepository.save(project);
    }

    // Archive/Delete a project
    @DeleteMapping("/{id}")
    public void archiveProject(@PathVariable Long id) {
        ProjectRepository.deleteById(id);
    }
}


