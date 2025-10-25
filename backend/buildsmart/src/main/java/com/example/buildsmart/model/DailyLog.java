package com.example.buildsmart.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_logs")  // Fixed table name - should match exactly
public class DailyLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(name = "log_date")
    private LocalDate logDate;
    
    @Column(name = "materials_used")
    private String materialsUsed;
    
    @Column(name = "labor_hours")
    private Double laborHours;
    
    @Column(name = "machinery_hours")
    private Double machineryHours;
    
    @Column(name = "comments")
    private String comments;
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Constructors
    public DailyLog() {
        // Default constructor
    }

    public DailyLog(Project project, LocalDate logDate, String materialsUsed,
                    Double laborHours, Double machineryHours, String comments,
                    String createdBy) {
        this.project = project;
        this.logDate = logDate;
        this.materialsUsed = materialsUsed;
        this.laborHours = laborHours;
        this.machineryHours = machineryHours;
        this.comments = comments;
        this.createdBy = createdBy;
        this.createdAt = LocalDateTime.now();  // Auto-set creation time
    }

    // Getters and setters with return statements
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

    public LocalDate getLogDate() {
        return logDate;
    }

    public void setLogDate(LocalDate logDate) {
        this.logDate = logDate;
    }

    public String getMaterialsUsed() {
        return materialsUsed;
    }

    public void setMaterialsUsed(String materialsUsed) {
        this.materialsUsed = materialsUsed;
    }

    public Double getLaborHours() {
        return laborHours;
    }

    public void setLaborHours(Double laborHours) {
        this.laborHours = laborHours;
    }

    public Double getMachineryHours() {
        return machineryHours;
    }

    public void setMachineryHours(Double machineryHours) {
        this.machineryHours = machineryHours;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
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

    // Helper methods for frontend compatibility
    public Long getProject_id() {
        return project != null ? project.getId() : null;
    }

    public LocalDate getLog_date() {
        return logDate;
    }

    public String getMaterials_used() {
        return materialsUsed;
    }

    public Double getLabor_hours() {
        return laborHours;
    }

    public Double getMachinery_hours() {
        return machineryHours;
    }

    public String getCreated_by() {
        return createdBy;
    }

    public LocalDateTime getCreated_at() {
        return createdAt;
    }

    // toString method for debugging
    @Override
    public String toString() {
        return "DailyLog{" +
                "id=" + id +
                ", logDate=" + logDate +
                ", materialsUsed='" + materialsUsed + '\'' +
                ", laborHours=" + laborHours +
                ", machineryHours=" + machineryHours +
                '}';
    }
}