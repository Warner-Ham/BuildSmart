package com.example.buildsmart.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "project")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String client;
    private String location;
    private String status;
    @Column(length = 2000)
    private String images; // Semicolon-separated image paths
    private java.sql.Date start_date;
    private java.sql.Date end_date;
    private Double curr_budget;
    private Double pre_budget;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getClient() { return client; }
    public void setClient(String client) { this.client = client; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getImages() { return images; }
    public void setImages(String images) { this.images = images; }
    public java.sql.Date getStart_date() { return start_date; }
    public void setStart_date(java.sql.Date start_date) { this.start_date = start_date; }
    public java.sql.Date getEnd_date() { return end_date; }
    public void setEnd_date(java.sql.Date end_date) { this.end_date = end_date; }
    public Double getCurr_budget() { return curr_budget; }
    public void setCurr_budget(Double curr_budget) { this.curr_budget = curr_budget; }
    public Double getPre_budget() { return pre_budget; }
    public void setPre_budget(Double pre_budget) { this.pre_budget = pre_budget; }
}
