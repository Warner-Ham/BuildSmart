package com.example.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.model.BudgetAlert;

@Repository
public interface BudgetAlertRepository extends JpaRepository<BudgetAlert, Long> {
    List<BudgetAlert> findByProjectId(Long projectId);
    List<BudgetAlert> findByStatus(String status);
}
