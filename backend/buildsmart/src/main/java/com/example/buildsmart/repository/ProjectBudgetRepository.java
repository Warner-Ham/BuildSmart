package com.example.buildsmart.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.buildsmart.model.ProjectBudget;

public interface ProjectBudgetRepository extends JpaRepository<ProjectBudget, Long> {
    @Query("SELECT SUM(pb.total_budget) FROM ProjectBudget pb WHERE pb.proj_id = :projId")
    Double sumTotalBudgetByProjectId(@Param("projId") Long projId);

    @Query("SELECT pb FROM ProjectBudget pb WHERE pb.proj_id = :projId")
    List<ProjectBudget> findByProj_Id(@Param("projId") Long projId);

    // New methods for monthly aggregation by cost category
    @Query("SELECT COALESCE(SUM(pb.machinery), 0) FROM ProjectBudget pb WHERE pb.proj_id = :projId AND pb.allocated_date BETWEEN :startDate AND :endDate")
    Double sumMachineryCostsByProjectAndDateRange(@Param("projId") Long projId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT COALESCE(SUM(pb.materials), 0) FROM ProjectBudget pb WHERE pb.proj_id = :projId AND pb.allocated_date BETWEEN :startDate AND :endDate")
    Double sumMaterialsCostsByProjectAndDateRange(@Param("projId") Long projId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT COALESCE(SUM(pb.labour_general), 0) FROM ProjectBudget pb WHERE pb.proj_id = :projId AND pb.allocated_date BETWEEN :startDate AND :endDate")
    Double sumLaborGeneralCostsByProjectAndDateRange(@Param("projId") Long projId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT COALESCE(SUM(pb.labour_skilled), 0) FROM ProjectBudget pb WHERE pb.proj_id = :projId AND pb.allocated_date BETWEEN :startDate AND :endDate")
    Double sumLaborSkilledCostsByProjectAndDateRange(@Param("projId") Long projId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT COALESCE(SUM(pb.subcontractors), 0) FROM ProjectBudget pb WHERE pb.proj_id = :projId AND pb.allocated_date BETWEEN :startDate AND :endDate")
    Double sumSubcontractorsCostsByProjectAndDateRange(@Param("projId") Long projId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT COALESCE(SUM(pb.other_costs), 0) FROM ProjectBudget pb WHERE pb.proj_id = :projId AND pb.allocated_date BETWEEN :startDate AND :endDate")
    Double sumOtherCostsByProjectAndDateRange(@Param("projId") Long projId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);
}