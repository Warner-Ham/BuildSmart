package com.example.buildsmart.repository;

import com.example.buildsmart.model.BudgetAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BudgetAlertRepository extends JpaRepository<BudgetAlert, Integer> {
}
