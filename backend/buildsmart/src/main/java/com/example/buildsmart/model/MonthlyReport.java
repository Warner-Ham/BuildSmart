package com.example.buildsmart.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "monthly_reports")
public class MonthlyReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "report_year", nullable = false)
    private Integer reportYear;

    @Column(name = "report_month", nullable = false)
    private Integer reportMonth;

    @Column(name = "total_materials_cost", precision = 10, scale = 2)
    private BigDecimal totalMaterialsCost;

    @Column(name = "total_labor_cost", precision = 10, scale = 2)
    private BigDecimal totalLaborCost;

    @Column(name = "total_machinery_cost", precision = 10, scale = 2)
    private BigDecimal totalMachineryCost;

    @Column(name = "total_subcontractors_cost", precision = 10, scale = 2)
    private BigDecimal totalSubcontractorsCost;

    @Column(name = "total_other_costs", precision = 10, scale = 2)
    private BigDecimal totalOtherCosts;

    @Column(name = "total_cost", precision = 10, scale = 2)
    private BigDecimal totalCost;

    @Column(name = "total_labor_hours")
    private Double totalLaborHours;

    @Column(name = "total_machinery_hours")
    private Double totalMachineryHours;

    @Column(name = "work_days")
    private Integer workDays;

    @Column(name = "productivity_score")
    private Double productivityScore;

    @Column(name = "budget_variance", precision = 10, scale = 2)
    private BigDecimal budgetVariance;

    @Column(name = "status")
    private String status; // DRAFT, SUBMITTED, APPROVED, REJECTED

    @Column(name = "notes", length = 2000)
    private String notes;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "approved_by")
    private String approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    // Constructors
    public MonthlyReport() {
        this.createdAt = LocalDateTime.now();
        this.status = "DRAFT";
    }

    public MonthlyReport(Project project, Integer reportYear, Integer reportMonth, String createdBy) {
        this();
        this.project = project;
        this.reportYear = reportYear;
        this.reportMonth = reportMonth;
        this.createdBy = createdBy;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Integer getReportYear() {
        return reportYear;
    }

    public void setReportYear(Integer reportYear) {
        this.reportYear = reportYear;
    }

    public Integer getReportMonth() {
        return reportMonth;
    }

    public void setReportMonth(Integer reportMonth) {
        this.reportMonth = reportMonth;
    }

    public BigDecimal getTotalMaterialsCost() {
        return totalMaterialsCost;
    }

    public void setTotalMaterialsCost(BigDecimal totalMaterialsCost) {
        this.totalMaterialsCost = totalMaterialsCost;
    }

    public BigDecimal getTotalLaborCost() {
        return totalLaborCost;
    }

    public void setTotalLaborCost(BigDecimal totalLaborCost) {
        this.totalLaborCost = totalLaborCost;
    }

    public BigDecimal getTotalMachineryCost() {
        return totalMachineryCost;
    }

    public void setTotalMachineryCost(BigDecimal totalMachineryCost) {
        this.totalMachineryCost = totalMachineryCost;
    }

    public BigDecimal getTotalSubcontractorsCost() {
        return totalSubcontractorsCost;
    }

    public void setTotalSubcontractorsCost(BigDecimal totalSubcontractorsCost) {
        this.totalSubcontractorsCost = totalSubcontractorsCost;
    }

    public BigDecimal getTotalOtherCosts() {
        return totalOtherCosts;
    }

    public void setTotalOtherCosts(BigDecimal totalOtherCosts) {
        this.totalOtherCosts = totalOtherCosts;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    public Double getTotalLaborHours() {
        return totalLaborHours;
    }

    public void setTotalLaborHours(Double totalLaborHours) {
        this.totalLaborHours = totalLaborHours;
    }

    public Double getTotalMachineryHours() {
        return totalMachineryHours;
    }

    public void setTotalMachineryHours(Double totalMachineryHours) {
        this.totalMachineryHours = totalMachineryHours;
    }

    public Integer getWorkDays() {
        return workDays;
    }

    public void setWorkDays(Integer workDays) {
        this.workDays = workDays;
    }

    public Double getProductivityScore() {
        return productivityScore;
    }

    public void setProductivityScore(Double productivityScore) {
        this.productivityScore = productivityScore;
    }

    public BigDecimal getBudgetVariance() {
        return budgetVariance;
    }

    public void setBudgetVariance(BigDecimal budgetVariance) {
        this.budgetVariance = budgetVariance;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(String approvedBy) {
        this.approvedBy = approvedBy;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }

    // Business methods
    public void calculateTotals() {
        BigDecimal materials = totalMaterialsCost != null ? totalMaterialsCost : BigDecimal.ZERO;
        BigDecimal labor = totalLaborCost != null ? totalLaborCost : BigDecimal.ZERO;
        BigDecimal machinery = totalMachineryCost != null ? totalMachineryCost : BigDecimal.ZERO;
        BigDecimal subcontractors = totalSubcontractorsCost != null ? totalSubcontractorsCost : BigDecimal.ZERO;
        BigDecimal otherCosts = totalOtherCosts != null ? totalOtherCosts : BigDecimal.ZERO;

        this.totalCost = materials.add(labor).add(machinery).add(subcontractors).add(otherCosts);
    }

    public void updateTimestamp(String updatedBy) {
        this.updatedBy = updatedBy;
        this.updatedAt = LocalDateTime.now();
    }

    public void approve(String approvedBy) {
        this.status = "APPROVED";
        this.approvedBy = approvedBy;
        this.approvedAt = LocalDateTime.now();
        updateTimestamp(approvedBy);
    }

    public void reject(String updatedBy) {
        this.status = "REJECTED";
        updateTimestamp(updatedBy);
    }

    public void submit(String updatedBy) {
        this.status = "SUBMITTED";
        updateTimestamp(updatedBy);
    }

    @Override
    public String toString() {
        return "MonthlyReport{" +
                "id=" + id +
                ", project=" + (project != null ? project.getName() : "null") +
                ", reportYear=" + reportYear +
                ", reportMonth=" + reportMonth +
                ", totalCost=" + totalCost +
                ", status='" + status + '\'' +
                '}';
    }
}
