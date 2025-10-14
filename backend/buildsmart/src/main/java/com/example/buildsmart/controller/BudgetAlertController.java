package com.example.buildsmart.controller;

import com.example.buildsmart.model.BudgetAlert;
import com.example.buildsmart.service.BudgetAlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budget-alerts")
@CrossOrigin("*")
public class BudgetAlertController {

    @Autowired
    private BudgetAlertService budgetAlertService;

    @GetMapping
    public List<BudgetAlert> getAllAlerts() {
        return budgetAlertService.getAllBudgetAlerts();
    }
}
