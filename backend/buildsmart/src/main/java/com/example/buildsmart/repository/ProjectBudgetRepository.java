package com.example.buildsmart.repository;

import com.example.buildsmart.model.ProjectBudget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProjectBudgetRepository extends JpaRepository<ProjectBudget, Long> {
    @Query("SELECT SUM(pb.total_budget) FROM ProjectBudget pb WHERE pb.proj_id = :projId")
    Double sumTotalBudgetByProjectId(@Param("projId") Long projId);

    @Query("SELECT pb FROM ProjectBudget pb WHERE pb.proj_id = :projId")
    List<ProjectBudget> findByProj_Id(@Param("projId") Long projId);
}