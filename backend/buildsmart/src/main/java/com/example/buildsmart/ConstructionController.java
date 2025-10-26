package com.example.buildsmart;

import java.util.List;

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
import com.example.buildsmart.repository.ProjectRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ConstructionController {
    @Autowired
    private ProjectRepository ProjectRepository;

    // Get sum of total_budget for a project
    @GetMapping("/api/projects/{id}/budgets/sum")
    public ResponseEntity<?> getProjectBudgetSum(@PathVariable Long id) {
        // For now, return 0.0 as placeholder - implement when ProjectBudgetRepository is available
        Double sum = 0.0;
        return ResponseEntity.ok(java.util.Collections.singletonMap("sum", sum));
    }

    @GetMapping("/api/projects")
    public List<Project> getProjects() {
        return ProjectRepository.findAll();
    }

    @PostMapping("/api/projects")
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        Project saved = ProjectRepository.save(project);
        return ResponseEntity.ok(saved);
    }

    // Update project details
    @PutMapping("/api/projects/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project update) {
        return ProjectRepository.findById(id)
                .map(project -> {
                    if (update.getName() != null) project.setName(update.getName());
                    if (update.getClient() != null) project.setClient(update.getClient());
                    if (update.getLocation() != null) project.setLocation(update.getLocation());
                    if (update.getStatus() != null) project.setStatus(update.getStatus());
                    if (update.getPre_budget() != null) project.setPre_budget(update.getPre_budget());
                    if (update.getCurr_budget() != null) project.setCurr_budget(update.getCurr_budget());
                    if (update.getStart_date() != null) project.setStart_date(update.getStart_date());
                    if (update.getEnd_date() != null) project.setEnd_date(update.getEnd_date());
                    if (update.getImages() != null) project.setImages(update.getImages());
                    Project saved = ProjectRepository.save(project);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/api/projects/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return ProjectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/api/projects/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        if (ProjectRepository.existsById(id)) {
            ProjectRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
