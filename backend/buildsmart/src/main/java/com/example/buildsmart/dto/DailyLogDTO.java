package com.example.buildsmart.dto;

import java.time.LocalDate;

public class DailyLogDTO {
    private Long project_id;
    private LocalDate log_date;
    private String materials_used;
    private Double labor_hours;
    private Double machinery_hours;
    private String comments;
    private String created_by;

    // Default constructor
    public DailyLogDTO() {}

    // Constructor with all fields
    public DailyLogDTO(Long project_id, LocalDate log_date, String materials_used,
                      Double labor_hours, Double machinery_hours, String comments, String created_by) {
        this.project_id = project_id;
        this.log_date = log_date;
        this.materials_used = materials_used;
        this.labor_hours = labor_hours;
        this.machinery_hours = machinery_hours;
        this.comments = comments;
        this.created_by = created_by;
    }

    // Getters and setters
    public Long getProject_id() {
        return project_id;
    }

    public void setProject_id(Long project_id) {
        this.project_id = project_id;
    }

    public LocalDate getLog_date() {
        return log_date;
    }

    public void setLog_date(LocalDate log_date) {
        this.log_date = log_date;
    }

    public String getMaterials_used() {
        return materials_used;
    }

    public void setMaterials_used(String materials_used) {
        this.materials_used = materials_used;
    }

    public Double getLabor_hours() {
        return labor_hours;
    }

    public void setLabor_hours(Double labor_hours) {
        this.labor_hours = labor_hours;
    }

    public Double getMachinery_hours() {
        return machinery_hours;
    }

    public void setMachinery_hours(Double machinery_hours) {
        this.machinery_hours = machinery_hours;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public String getCreated_by() {
        return created_by;
    }

    public void setCreated_by(String created_by) {
        this.created_by = created_by;
    }
}