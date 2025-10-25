package com.example.buildsmart.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class MonthlyReportSummaryDTO {

    private Long reportId;
    private Long projectId;
    private String projectName;
    private String projectLocation;
    private Integer reportYear;
    private Integer reportMonth;
    private BigDecimal totalCost;
    private BigDecimal budgetVariance;
    private String status;
    private Double productivityScore;
    private String createdBy;
    private LocalDateTime createdAt;
    private String approvedBy;
    private LocalDateTime approvedAt;

    // Constructors
    public MonthlyReportSummaryDTO() {}

    public MonthlyReportSummaryDTO(Long reportId, Long projectId, String projectName,
                                   Integer reportYear, Integer reportMonth,
                                   BigDecimal totalCost, String status) {
        this.reportId = reportId;
        this.projectId = projectId;
        this.projectName = projectName;
        this.reportYear = reportYear;
        this.reportMonth = reportMonth;
        this.totalCost = totalCost;
        this.status = status;
    }

    // Getters and setters
    public Long getReportId() {
        return reportId;
    }

    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
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

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
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

    public Double getProductivityScore() {
        return productivityScore;
    }

    public void setProductivityScore(Double productivityScore) {
        this.productivityScore = productivityScore;
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

    @Override
    public String toString() {
        return "MonthlyReportSummaryDTO{" +
                "reportId=" + reportId +
                ", projectName='" + projectName + '\'' +
                ", reportYear=" + reportYear +
                ", reportMonth=" + reportMonth +
                ", totalCost=" + totalCost +
                ", status='" + status + '\'' +
                '}';
    }
}
