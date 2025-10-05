package com.example.buildsmart;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.buildsmart.model.ProjectRequest;
import com.example.buildsmart.repository.ProjectRequestRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ProjectRequestController {
    @Autowired
    private ProjectRequestRepository projectRequestRepository;

    @PostMapping("/api/project-requests")
    public ProjectRequest createProjectRequest(@RequestBody ProjectRequest request) {
        request.setRequestDate(LocalDate.now());
        return projectRequestRepository.save(request);
    }
}
