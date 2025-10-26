package com.example.buildsmart.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.buildsmart.model.Project;
import com.example.buildsmart.model.ProjectRequest;
import com.example.buildsmart.repository.ProjectRequestRepository;
import com.example.buildsmart.repository.ProjectRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ProjectRequestController {
    @Autowired
    private ProjectRequestRepository projectRequestRepository;

    @Autowired
    private ProjectRepository projectRepository;

    // Create a new project ProjectRequest
    @PostMapping("/api/project-ProjectRequests")
    public ProjectRequest createProjectRequest(@RequestBody ProjectRequest projectRequest) {
        projectRequest.setProjectRequestDate(LocalDate.now());
        projectRequest.setStatus("Pending");
        return projectRequestRepository.save(projectRequest);
    }

    // Get all project ProjectRequests
    @GetMapping("/api/project-ProjectRequests")
    public List<ProjectRequest> getAllProjectRequests() {
        return ProjectRequestRepository.findAll();
    }

    // Get a specific project ProjectRequest by ID
    @GetMapping("/api/project-ProjectRequests/{id}")
    public ResponseEntity<ProjectRequest> getProjectRequestById(@PathVariable Long id) {
        Optional<ProjectRequest> ProjectRequest = ProjectRequestRepository.findById(id);
        return ProjectRequest.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Update a project ProjectRequest
    @PutMapping("/api/project-ProjectRequests/{id}")
    public ResponseEntity<ProjectRequest> updateProjectRequest(@PathVariable Long id, @RequestBody ProjectRequest updatedProjectRequest) {
        return projectRequestRepository.findById(id)
                .map(projectRequest -> {
                    projectRequest.setClient(updatedProjectRequest.getClient());
                    projectRequest.setEmail(updatedProjectRequest.getEmail());
                    projectRequest.setLocation(updatedProjectRequest.getLocation());
                    projectRequest.setDescription(updatedProjectRequest.getDescription());
                    ProjectRequest saved = projectRequestRepository.save(projectRequest);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Soft delete a project ProjectRequest (mark as deleted)
    @DeleteMapping("/api/project-ProjectRequests/{id}")
    public ResponseEntity<Void> deleteProjectRequest(@PathVariable Long id) {
        Optional<ProjectRequest> projectRequestOpt = projectRequestRepository.findById(id);
        if (projectRequestOpt.isPresent()) {
            ProjectRequest projectRequest = projectRequestOpt.get();
            projectRequest.setDeleted(true);
            projectRequestRepository.save(projectRequest);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Restore a deleted project ProjectRequest
    @PutMapping("/api/project-ProjectRequests/{id}/restore")
    public ResponseEntity<ProjectRequest> restoreProjectRequest(@PathVariable Long id) {
        return projectRequestRepository.findById(id)
                .map(projectRequest -> {
                    projectRequest.setDeleted(false);
                    ProjectRequest saved = projectRequestRepository.save(projectRequest);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Approve a project ProjectRequest and convert it to a project
    @PostMapping("/api/project-ProjectRequests/{id}/approve")
    public ResponseEntity<Project> approveProjectRequest(@PathVariable Long id, @RequestBody Project projectData) {
        Optional<ProjectRequest> projectRequestOpt = projectRequestRepository.findById(id);
        if (projectRequestOpt.isPresent()) {
            ProjectRequest projectRequest = projectRequestOpt.get();

            // Create new project from ProjectRequest data
            Project project = new Project();
            project.setName(projectData.getName() != null ? projectData.getName() : ProjectRequest.getClient() + " Project");
            project.setClient(ProjectRequest.getClient());
            project.setLocation(ProjectRequest.getLocation());
            project.setStatus("In Progress");
            project.setPre_budget(projectData.getPre_budget());
            project.setCurr_budget(projectData.getPre_budget());
            project.setStart_date(java.sql.Date.valueOf(LocalDate.now()));

            Project savedProject = projectRepository.save(project);

            // Delete the original ProjectRequest
            projectRequestRepository.deleteById(id);

            return ResponseEntity.ok(savedProject);
        }
        return ResponseEntity.notFound().build();
    }
}
