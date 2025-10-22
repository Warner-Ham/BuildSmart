package com.example.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.model.BudgetAlert;
import com.example.repository.BudgetAlertRepository;

@Service
public class BudgetAlertService {

    private final BudgetAlertRepository budgetAlertRepository;

    @Autowired
    public BudgetAlertService(BudgetAlertRepository budgetAlertRepository) {
        this.budgetAlertRepository = budgetAlertRepository;
    }

    public List<BudgetAlert> getAllBudgetAlerts() {
        return budgetAlertRepository.findAll();
    }

    public Optional<BudgetAlert> getBudgetAlertById(Long id) {
        return budgetAlertRepository.findById(id);
    }

    public List<BudgetAlert> getBudgetAlertsByProjectId(Long projectId) {
        return budgetAlertRepository.findByProjectId(projectId);
    }

    public List<BudgetAlert> getBudgetAlertsByStatus(String status) {
        return budgetAlertRepository.findByStatus(status);
    }

    public BudgetAlert createBudgetAlert(BudgetAlert budgetAlert) {
        return budgetAlertRepository.save(budgetAlert);
    }

    public BudgetAlert updateBudgetAlert(Long id, BudgetAlert updatedBudgetAlert) {
        return budgetAlertRepository.findById(id).map(existingAlert -> {
            existingAlert.setProjectId(updatedBudgetAlert.getProjectId());
            existingAlert.setStatus(updatedBudgetAlert.getStatus());
            existingAlert.setThreshold(updatedBudgetAlert.getThreshold());
            existingAlert.setMessage(updatedBudgetAlert.getMessage());
            return budgetAlertRepository.save(existingAlert);
        }).orElseThrow(() -> new RuntimeException("BudgetAlert not found"));
    }

    public void deleteBudgetAlert(Long id) {
        budgetAlertRepository.deleteById(id);
    }
}