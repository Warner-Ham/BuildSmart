package com.example.buildsmart.controller;

import com.example.buildsmart.model.ProjectBudget;
import com.example.buildsmart.repository.ProjectBudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api")
public class ProjectBudgetController {
    @Autowired
    private ProjectBudgetRepository projectBudgetRepository;

    // Get all budgets
    @GetMapping("/project-budgets")
    public List<ProjectBudget> getAllBudgets() {
        return projectBudgetRepository.findAll();
    }

    // Get budgets for a project
    @GetMapping("/project-budgets/project/{proj_id}")
    public List<ProjectBudget> getBudgetsByProject(@PathVariable Long proj_id) {
        return projectBudgetRepository.findByProj_Id(proj_id);
    }

    // Create a budget (generic)
    @PostMapping("/project-budgets")
    public ProjectBudget createBudget(@RequestBody ProjectBudget budget) {
        return projectBudgetRepository.save(budget);
    }

    // Update a specific budget record by ID
    @PutMapping("/project-budgets/{bgt_id}")
    public ResponseEntity<ProjectBudget> updateBudget(@PathVariable Long bgt_id, @RequestBody ProjectBudget budget) {
        Optional<ProjectBudget> existingBudget = projectBudgetRepository.findById(bgt_id);
        if (existingBudget.isEmpty()) return ResponseEntity.notFound().build();

        ProjectBudget existing = existingBudget.get();
        if (budget.getMachinery() != null) existing.setMachinery(budget.getMachinery());
        if (budget.getMaterials() != null) existing.setMaterials(budget.getMaterials());
        if (budget.getLabour_general() != null) existing.setLabour_general(budget.getLabour_general());
        if (budget.getLabour_skilled() != null) existing.setLabour_skilled(budget.getLabour_skilled());
        if (budget.getSubcontractors() != null) existing.setSubcontractors(budget.getSubcontractors());
        if (budget.getOther_costs() != null) existing.setOther_costs(budget.getOther_costs());
        if (budget.getTotal_budget() != null) existing.setTotal_budget(budget.getTotal_budget());
        if (budget.getAllocated_date() != null) existing.setAllocated_date(budget.getAllocated_date());

        ProjectBudget saved = projectBudgetRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    // Delete a budget
    @DeleteMapping("/project-budgets/{bgt_id}")
    public void deleteBudget(@PathVariable Long bgt_id) {
        projectBudgetRepository.deleteById(bgt_id);
    }

    // --- New endpoints for /api/projects/{id}/budget, /usage, /budget/report ---

    // Get budget for a project (single, latest)
    @GetMapping("/projects/{id}/budget")
    public ResponseEntity<ProjectBudget> getProjectBudget(@PathVariable Long id) {
        List<ProjectBudget> budgets = projectBudgetRepository.findByProj_Id(id);
        if (budgets.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(budgets.get(budgets.size()-1));
    }

    // Create budget for a project
    @PostMapping("/projects/{id}/budget")
    public ResponseEntity<ProjectBudget> createProjectBudget(@PathVariable Long id, @RequestBody ProjectBudget budget) {
        budget.setProj_id(id);
        ProjectBudget saved = projectBudgetRepository.save(budget);
        return ResponseEntity.ok(saved);
    }

    // Update budget for a project (PUT)
    @PutMapping("/projects/{id}/budget")
    public ResponseEntity<ProjectBudget> updateProjectBudget(@PathVariable Long id, @RequestBody ProjectBudget budget) {
        List<ProjectBudget> budgets = projectBudgetRepository.findByProj_Id(id);
        if (budgets.isEmpty()) return ResponseEntity.notFound().build();
        ProjectBudget existing = budgets.get(budgets.size()-1);
        // Update fields
        existing.setMachinery(budget.getMachinery());
        existing.setMaterials(budget.getMaterials());
        existing.setLabour_general(budget.getLabour_general());
        existing.setLabour_skilled(budget.getLabour_skilled());
        existing.setSubcontractors(budget.getSubcontractors());
        existing.setOther_costs(budget.getOther_costs());
        existing.setTotal_budget(budget.getTotal_budget());
        existing.setAllocated_date(budget.getAllocated_date());
        ProjectBudget saved = projectBudgetRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    // Log daily usage for a project (POST)
    @PostMapping("/projects/{id}/usage")
    public ResponseEntity<ProjectBudget> logUsage(@PathVariable Long id, @RequestBody ProjectBudget usage) {
        // For demo: create a new budget entry with usage fields
        usage.setProj_id(id);
        ProjectBudget saved = projectBudgetRepository.save(usage);
        return ResponseEntity.ok(saved);
    }

    // Generate budget report for a project
    @GetMapping("/projects/{id}/budget/report")
    public ResponseEntity<?> getBudgetReport(@PathVariable Long id) {
        List<ProjectBudget> budgets = projectBudgetRepository.findByProj_Id(id);
        if (budgets.isEmpty()) return ResponseEntity.notFound().build();
        ProjectBudget budget = budgets.get(budgets.size()-1);
        // Simple report: sum all costs and compare to total_budget
        double spent = (budget.getMachinery() != null ? budget.getMachinery() : 0)
                + (budget.getMaterials() != null ? budget.getMaterials() : 0)
                + (budget.getLabour_general() != null ? budget.getLabour_general() : 0)
                + (budget.getLabour_skilled() != null ? budget.getLabour_skilled() : 0)
                + (budget.getSubcontractors() != null ? budget.getSubcontractors() : 0)
                + (budget.getOther_costs() != null ? budget.getOther_costs() : 0);
        double total = budget.getTotal_budget() != null ? budget.getTotal_budget() : 0;
        return ResponseEntity.ok(new java.util.HashMap<String, Object>() {{
            put("project_id", id);
            put("total_budget", total);
            put("total_spent", spent);
            put("remaining", total - spent);
            put("details", budget);
        }});
    }
}
