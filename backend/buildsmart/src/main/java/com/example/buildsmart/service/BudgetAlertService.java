package com.example.buildsmart.service;

import com.example.buildsmart.model.BudgetAlert;
import java.util.List;

public interface BudgetAlertService {
    List<BudgetAlert> getAllBudgetAlerts();
    BudgetAlert createBudgetAlert(BudgetAlert budgetAlert);
    void resolveAlertsForProject(int projectId);
}
