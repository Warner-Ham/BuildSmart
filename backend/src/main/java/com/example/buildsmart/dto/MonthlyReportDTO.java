package com.example.buildsmart.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class MonthlyReportDTO {
    
    private Long id;
    
    @NotNull(message = "Project ID is required")
    private Long projectId;
    
    @NotNull(message = "Report year is required")
    @Min(value = 2020, message = "Report year must be 2020 or later")
    @Max(value = 2030, message = "Report year must be 2030 or earlier")
    private Integer reportYear;
    
    @NotNull(message = "Report month is required")
    @Min(value = 1, message = "Report month must be between 1 and 12")
    @Max(value = 12, message = "Report month must be between 1 and 12")
    private Integer reportMonth;
    
    @DecimalMin(value = "0.0", message = "Total materials cost must be non-negative")
    private BigDecimal totalMaterialsCost;
    
    @DecimalMin(value = "0.0", message = "Total labor cost must be non-negative")
    private BigDecimal totalLaborCost;
    
    @DecimalMin(value = "0.0", message = "Total machinery cost must be non-negative")
    private BigDecimal totalMachineryCost;
    
    @DecimalMin(value = "0.0", message = "Total cost must be non-negative")
    private BigDecimal totalCost;
    
    @DecimalMin(value = "0.0", message = "Total labor hours must be non-negative")
    private Double totalLaborHours;
    
    @DecimalMin(value = "0.0", message = "Total machinery hours must be non-negative")
    private Double totalMachineryHours;
    
    @Min(value = 0, message = "Work days must be non-negative")
    private Integer workDays;
    
    @DecimalMin(value = "0.0", message = "Productivity score must be non-negative")
    @DecimalMax(value = "100.0", message = "Productivity score cannot exceed 100")
    private Double productivityScore;
    
    private BigDecimal budgetVariance;
    
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(DRAFT|SUBMITTED|APPROVED|REJECTED)$", message = "Status must be DRAFT, SUBMITTED, APPROVED, or REJECTED")
    private String status;
    
    @Size(max = 2000, message = "Notes cannot exceed 2000 characters")
    private String notes;
    
    private String createdBy;
    private LocalDateTime createdAt;
    private String updatedBy;
    private LocalDateTime updatedAt;
    private String approvedBy;
    private LocalDateTime approvedAt;
    
    // Project details (for response)
    private String projectName;
    private String projectLocation;
    private String projectStatus;
    
    // Constructors
    public MonthlyReportDTO() {}
    
    public MonthlyReportDTO(Long projectId, Integer reportYear, Integer reportMonth) {
        this.projectId = projectId;
        this.reportYear = reportYear;
        this.reportMonth = reportMonth;
        this.status = "DRAFT";
    }
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getProjectId() {
        return projectId;
    }
    
    public void setProjectId(Long projectId) {
        this.projectId = projectId;
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
    
    public String getProjectName() {
        return projectName;
    }
    
    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }
    
    public String getProjectLocation() {
        return projectLocation;
    }
    
    public void setProjectLocation(String projectLocation) {
        this.projectLocation = projectLocation;
    }
    
    public String getProjectStatus() {
        return projectStatus;
    }
    
    public void setProjectStatus(String projectStatus) {
        this.projectStatus = projectStatus;
    }
    
    @Override
    public String toString() {
        return "MonthlyReportDTO{" +
                "id=" + id +
                ", projectId=" + projectId +
                ", reportYear=" + reportYear +
                ", reportMonth=" + reportMonth +
                ", totalCost=" + totalCost +
                ", status='" + status + '\'' +
                '}';
    }
}
