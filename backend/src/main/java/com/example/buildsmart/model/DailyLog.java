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

    private LocalDate logDate;
    private String materialsUsed;
    private Double laborHours;
    private Double machineryHours;
    private String comments;
    private String createdBy;
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