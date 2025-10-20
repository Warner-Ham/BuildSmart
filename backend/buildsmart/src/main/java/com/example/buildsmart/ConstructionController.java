package com.example.buildsmart;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.buildsmart.model.Project;
import com.example.buildsmart.repository.ProjectRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ConstructionController {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private com.example.buildsmart.repository.ProjectBudgetRepository projectBudgetRepository;
    // Get sum of total_budget for a project
    @GetMapping("/api/projects/{id}/budgets/sum")
    public ResponseEntity<?> getProjectBudgetSum(@PathVariable Long id) {
        Double sum = projectBudgetRepository.sumTotalBudgetByProjectId(id);
        if (sum == null) sum = 0.0;
        return ResponseEntity.ok(java.util.Collections.singletonMap("sum", sum));
    }

    @GetMapping("/api/projects")
    public List<Project> getProjects() {
        return projectRepository.findAll();
    }

    @GetMapping("/api/projects/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Create new project
    @PostMapping("/api/projects")
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        Project savedProject = projectRepository.save(project);
        return ResponseEntity.ok(savedProject);
    }

    // Update project (full update)
    @PutMapping("/api/projects/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project update) {
        return projectRepository.findById(id)
            .map(project -> {
                // Update all fields
                if (update.getName() != null) project.setName(update.getName());
                if (update.getClient() != null) project.setClient(update.getClient());
                if (update.getLocation() != null) project.setLocation(update.getLocation());
                if (update.getStatus() != null) project.setStatus(update.getStatus());
                if (update.getStart_date() != null) project.setStart_date(update.getStart_date());
                if (update.getEnd_date() != null) project.setEnd_date(update.getEnd_date());
                if (update.getPre_budget() != null) project.setPre_budget(update.getPre_budget());
                if (update.getCurr_budget() != null) project.setCurr_budget(update.getCurr_budget());
                if (update.getDescription() != null) project.setDescription(update.getDescription());
                if (update.getProjectType() != null) project.setProjectType(update.getProjectType());
                if (update.getAssignedStaff() != null) project.setAssignedStaff(update.getAssignedStaff());
                if (update.getPriority() != null) project.setPriority(update.getPriority());
                if (update.getNotes() != null) project.setNotes(update.getNotes());
                if (update.getBudget_date() != null) project.setBudget_date(update.getBudget_date());
                
                Project saved = projectRepository.save(project);
                return ResponseEntity.ok(saved);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // Delete project
    @DeleteMapping("/api/projects/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
