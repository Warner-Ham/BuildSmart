package com.example.buildsmart.services;

import com.example.buildsmart.model.Project;
import com.example.buildsmart.model.Request;
import com.example.buildsmart.repository.ProjectRepository;
import com.example.buildsmart.repository.RequestRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// inside src/main/java/com/example/buildsmart/service (create if not exists)
@Service
public class ProjectService {
    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private ProjectRepository ProjectRepository;

    public Project approveRequest(Long requestId, Project projectDetails) {
        // Find the pending request
        Request request = requestRepository.findById(requestId).orElseThrow(() -> new EntityNotFoundException("Request not found"));

        if (!"pending".equals(request.getStatus())) {
            throw new IllegalStateException("Request is not pending and cannot be approved.");
        }

        // Update the request status
        request.setStatus("approved");
        requestRepository.save(request);

        // Create a new project from the request details
        Project newProject = new Project();
        newProject.setName(projectDetails.getName());
        newProject.setLocation(request.getLocation());
        newProject.setClient(request.getClient());
        newProject.setPre_budget(projectDetails.getPre_budget());
        newProject.setStart_date(projectDetails.getStart_date());
        newProject.setEnd_date(projectDetails.getEnd_date());
        newProject.setStatus("active");

        return ProjectRepository.save(newProject);
    }
}
