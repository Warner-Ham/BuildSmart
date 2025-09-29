package com.example.buildsmart.dto;

import java.time.LocalDate;

public class DailyLogDTO {
    private Long id;
    private Long projectId;
    private LocalDate logDate;
    private String materialsUsed;
    private Double laborHours;
    private Double machineryHours;
    private String comments;
    private String createdBy;

    // Constructors
    public DailyLogDTO() {}

    public DailyLogDTO(Long projectId, LocalDate logDate, String materialsUsed,
                       Double laborHours, Double machineryHours, String comments, String createdBy) {
        this.projectId = projectId;
        this.logDate = logDate;
        this.materialsUsed = materialsUsed;
        this.laborHours = laborHours;
        this.machineryHours = machineryHours;
        this.comments = comments;
        this.createdBy = createdBy;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    public LocalDate getLogDate() { return logDate; }
    public void setLogDate(LocalDate logDate) { this.logDate = logDate; }
    public String getMaterialsUsed() { return materialsUsed; }
    public void setMaterialsUsed(String materialsUsed) { this.materialsUsed = materialsUsed; }
    public Double getLaborHours() { return laborHours; }
    public void setLaborHours(Double laborHours) { this.laborHours = laborHours; }
    public Double getMachineryHours() { return machineryHours; }
    public void setMachineryHours(Double machineryHours) { this.machineryHours = machineryHours; }
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
}
