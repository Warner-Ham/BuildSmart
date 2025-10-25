package com.example.buildsmart.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "project_requests")
public class ProjectRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String client;
    private String email;
    private String location;
    private String description;
    private String status;
    private LocalDate requestDate;

    public ProjectRequest() {}

    public ProjectRequest(String client, String email, String location, String description) {
        this.client = client;
        this.email = email;
        this.location = location;
        this.description = description;
        this.status = "Pending";
    }

    public Long getId() { return id; }
    public String getClient() { return client; }
    public void setClient(String client) { this.client = client; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getRequestDate() { return requestDate; }
    public void setRequestDate(LocalDate requestDate) { this.requestDate = requestDate; }
}
