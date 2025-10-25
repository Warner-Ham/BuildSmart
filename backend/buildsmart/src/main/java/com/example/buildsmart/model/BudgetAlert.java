package com.example.buildsmart.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "budget_alerts")
public class BudgetAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int alert_id;

    private int project_id;
    private LocalDate alert_date;
    private double amount_over_budget;
    private String status;

    // Getters and Setters
    public int getAlert_id() {
        return alert_id;
    }

    public void setAlert_id(int alert_id) {
        this.alert_id = alert_id;
    }

    public int getProject_id() {
        return project_id;
    }

    public void setProject_id(int project_id) {
        this.project_id = project_id;
    }

    public LocalDate getAlert_date() {
        return alert_date;
    }

    public void setAlert_date(LocalDate alert_date) {
        this.alert_date = alert_date;
    }

    public double getAmount_over_budget() {
        return amount_over_budget;
    }

    public void setAmount_over_budget(double amount_over_budget) {
        this.amount_over_budget = amount_over_budget;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
