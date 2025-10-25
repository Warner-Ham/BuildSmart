package com.example.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.model.BudgetAlert;
import com.example.service.BudgetAlertService;

@RestController
@RequestMapping("/api/budget-alerts")
public class BudgetAlertController {

    private final BudgetAlertService budgetAlertService;

    @Autowired
    public BudgetAlertController(BudgetAlertService budgetAlertService) {
        this.budgetAlertService = budgetAlertService;
    }

    @GetMapping
    public List<BudgetAlert> getAllBudgetAlerts() {
        return budgetAlertService.getAllBudgetAlerts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BudgetAlert> getBudgetAlertById(@PathVariable Long id) {
        Optional<BudgetAlert> budgetAlert = budgetAlertService.getBudgetAlertById(id);
        return budgetAlert.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/project/{projectId}")
    public List<BudgetAlert> getBudgetAlertsByProjectId(@PathVariable Long projectId) {
        return budgetAlertService.getBudgetAlertsByProjectId(projectId);
    }

    @GetMapping("/status/{status}")
    public List<BudgetAlert> getBudgetAlertsByStatus(@PathVariable String status) {
        return budgetAlertService.getBudgetAlertsByStatus(status);
    }

    @PostMapping
    public BudgetAlert createBudgetAlert(@RequestBody BudgetAlert budgetAlert) {
        return budgetAlertService.createBudgetAlert(budgetAlert);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetAlert> updateBudgetAlert(@PathVariable Long id, @RequestBody BudgetAlert updatedBudgetAlert) {
        try {
            BudgetAlert updatedAlert = budgetAlertService.updateBudgetAlert(id, updatedBudgetAlert);
            return ResponseEntity.ok(updatedAlert);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudgetAlert(@PathVariable Long id) {
        budgetAlertService.deleteBudgetAlert(id);
        return ResponseEntity.noContent().build();
    }
}