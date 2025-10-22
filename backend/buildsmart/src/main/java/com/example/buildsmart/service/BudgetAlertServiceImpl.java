package com.example.buildsmart.service;

import com.example.buildsmart.model.BudgetAlert;
import com.example.buildsmart.repository.BudgetAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BudgetAlertServiceImpl implements BudgetAlertService {

    @Autowired
    private BudgetAlertRepository budgetAlertRepository;

    @Override
    public List<BudgetAlert> getAllBudgetAlerts() {
        return budgetAlertRepository.findAll();
    }

    @Override
    public BudgetAlert createBudgetAlert(BudgetAlert budgetAlert) {
        return budgetAlertRepository.save(budgetAlert);
    }

    @Override
    public void resolveAlertsForProject(int projectId) {
        // This is a simplified implementation. In a real application, you would
        // likely have more complex logic to determine if a project is no longer overbudget.
        List<BudgetAlert> alerts = budgetAlertRepository.findAll();
        for (BudgetAlert alert : alerts) {
            if (alert.getProject_id() == projectId && "ongoing".equalsIgnoreCase(alert.getStatus())) {
                alert.setStatus("resolved");
                budgetAlertRepository.save(alert);
            }
        }
    }
}
