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
import com.example.buildsmart.model.Request;
import com.example.buildsmart.repository.RequestRepository;
import com.example.buildsmart.repository.ProjectRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class RequestController {
    @Autowired
    private RequestRepository RequestRepository;

    @Autowired
    private ProjectRepository ProjectRepository;

    // Create a new project request
    @PostMapping("/api/project-requests")
    public Request createRequest(@RequestBody Request request) {
        request.setRequestDate(LocalDate.now());
        request.setStatus("Pending");
        return RequestRepository.save(request);
    }

    // Get all project requests
    @GetMapping("/api/project-requests")
    public List<Request> getAllRequests() {
        return RequestRepository.findAll();
    }

    // Get a specific project request by ID
    @GetMapping("/api/project-requests/{id}")
    public ResponseEntity<Request> getRequestById(@PathVariable Long id) {
        Optional<Request> request = RequestRepository.findById(id);
        return request.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Update a project request
    @PutMapping("/api/project-requests/{id}")
    public ResponseEntity<Request> updateRequest(@PathVariable Long id, @RequestBody Request updatedRequest) {
        return RequestRepository.findById(id)
                .map(request -> {
                    request.setClient(updatedRequest.getClient());
                    request.setEmail(updatedRequest.getEmail());
                    request.setLocation(updatedRequest.getLocation());
                    request.setDescription(updatedRequest.getDescription());
                    Request saved = RequestRepository.save(request);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Soft delete a project request (mark as deleted)
    @DeleteMapping("/api/project-requests/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        Optional<Request> requestOpt = RequestRepository.findById(id);
        if (requestOpt.isPresent()) {
            Request request = requestOpt.get();
            request.setDeleted(true);
            RequestRepository.save(request);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Restore a deleted project request
    @PutMapping("/api/project-requests/{id}/restore")
    public ResponseEntity<Request> restoreRequest(@PathVariable Long id) {
        return RequestRepository.findById(id)
                .map(request -> {
                    request.setDeleted(false);
                    Request saved = RequestRepository.save(request);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Approve a project request and convert it to a project
    @PostMapping("/api/project-requests/{id}/approve")
    public ResponseEntity<Project> approveRequest(@PathVariable Long id, @RequestBody Project projectData) {
        Optional<Request> requestOpt = RequestRepository.findById(id);
        if (requestOpt.isPresent()) {
            Request request = requestOpt.get();

            // Create new project from request data
            Project project = new Project();
            project.setName(projectData.getName() != null ? projectData.getName() : request.getClient() + " Project");
            project.setClient(request.getClient());
            project.setLocation(request.getLocation());
            project.setStatus("In Progress");
            project.setPre_budget(projectData.getPre_budget());
            project.setCurr_budget(projectData.getPre_budget());
            project.setStart_date(java.sql.Date.valueOf(LocalDate.now()));

            Project savedProject = ProjectRepository.save(project);

            // Delete the original request
            RequestRepository.deleteById(id);

            return ResponseEntity.ok(savedProject);
        }
        return ResponseEntity.notFound().build();
    }
}
