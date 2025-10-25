package com.example.buildsmart.repository;

import com.example.buildsmart.model.MonthlyReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MonthlyReportRepository extends JpaRepository<MonthlyReport, Long> {

    // Find reports by project
    List<MonthlyReport> findByProjectIdOrderByReportYearDescReportMonthDesc(Long projectId);

    // Find reports by project and year
    List<MonthlyReport> findByProjectIdAndReportYearOrderByReportMonthDesc(Long projectId, Integer reportYear);

    // Find specific report by project, year, and month
    Optional<MonthlyReport> findByProjectIdAndReportYearAndReportMonth(Long projectId, Integer reportYear, Integer reportMonth);

    // Find reports by status
    List<MonthlyReport> findByStatusOrderByCreatedAtDesc(String status);

    // Find reports by multiple statuses
    List<MonthlyReport> findByStatusInOrderByCreatedAtDesc(List<String> statuses);

    // Find reports by project and status
    List<MonthlyReport> findByProjectIdAndStatusOrderByReportYearDescReportMonthDesc(Long projectId, String status);

    // Find reports created by specific user
    List<MonthlyReport> findByCreatedByOrderByCreatedAtDesc(String createdBy);

    // Find reports within date range
    @Query("SELECT mr FROM MonthlyReport mr WHERE mr.project.id = :projectId " +
            "AND (mr.reportYear > :startYear OR (mr.reportYear = :startYear AND mr.reportMonth >= :startMonth)) " +
            "AND (mr.reportYear < :endYear OR (mr.reportYear = :endYear AND mr.reportMonth <= :endMonth)) " +
            "ORDER BY mr.reportYear DESC, mr.reportMonth DESC")
    List<MonthlyReport> findReportsInDateRange(@Param("projectId") Long projectId,
                                               @Param("startYear") Integer startYear,
                                               @Param("startMonth") Integer startMonth,
                                               @Param("endYear") Integer endYear,
                                               @Param("endMonth") Integer endMonth);

    // Find reports with budget variance above threshold
    @Query("SELECT mr FROM MonthlyReport mr WHERE mr.budgetVariance > :threshold " +
            "ORDER BY mr.budgetVariance DESC")
    List<MonthlyReport> findReportsWithHighVariance(@Param("threshold") java.math.BigDecimal threshold);

    // Find reports by project with high variance
    @Query("SELECT mr FROM MonthlyReport mr WHERE mr.project.id = :projectId " +
            "AND mr.budgetVariance > :threshold " +
            "ORDER BY mr.budgetVariance DESC")
    List<MonthlyReport> findProjectReportsWithHighVariance(@Param("projectId") Long projectId,
                                                           @Param("threshold") java.math.BigDecimal threshold);

    // Count reports by status
    long countByStatus(String status);

    // Count reports by project and status
    long countByProjectIdAndStatus(Long projectId, String status);

    // Find latest report for a project
    @Query("SELECT mr FROM MonthlyReport mr WHERE mr.project.id = :projectId " +
            "ORDER BY mr.reportYear DESC, mr.reportMonth DESC")
    List<MonthlyReport> findLatestReportForProject(@Param("projectId") Long projectId);

    // Find reports pending approval
    @Query("SELECT mr FROM MonthlyReport mr WHERE mr.status = 'SUBMITTED' " +
            "ORDER BY mr.createdAt ASC")
    List<MonthlyReport> findPendingApprovalReports();

    // Find reports by productivity score range
    @Query("SELECT mr FROM MonthlyReport mr WHERE mr.productivityScore BETWEEN :minScore AND :maxScore " +
            "ORDER BY mr.productivityScore DESC")
    List<MonthlyReport> findReportsByProductivityRange(@Param("minScore") Double minScore,
                                                       @Param("maxScore") Double maxScore);

    // Find reports with total cost above threshold
    @Query("SELECT mr FROM MonthlyReport mr WHERE mr.totalCost > :threshold " +
            "ORDER BY mr.totalCost DESC")
    List<MonthlyReport> findReportsWithHighCost(@Param("threshold") java.math.BigDecimal threshold);
}