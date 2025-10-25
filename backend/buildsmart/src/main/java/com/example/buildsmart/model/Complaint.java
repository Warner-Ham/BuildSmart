package com.example.buildsmart.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "complaints")
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String clientName;
    private String email;
    private String phone;
    private String projectId;
    private String complaintType;
    private String subject;
    private String description;
    private String severity;
    private String preferredResolution;
    private String status;
    private LocalDate complaintDate;
    private String assignedTo;
    private String resolution;
    private String notes;

    // Constructors
    public Complaint() {}

    public Complaint(String clientName, String email, String complaintType, String subject, String description) {
        this.clientName = clientName;
        this.email = email;
        this.complaintType = complaintType;
        this.subject = subject;
        this.description = description;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }

    public String getComplaintType() { return complaintType; }
    public void setComplaintType(String complaintType) { this.complaintType = complaintType; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getPreferredResolution() { return preferredResolution; }
    public void setPreferredResolution(String preferredResolution) { this.preferredResolution = preferredResolution; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getComplaintDate() { return complaintDate; }
    public void setComplaintDate(LocalDate complaintDate) { this.complaintDate = complaintDate; }

    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }

    public String getResolution() { return resolution; }
    public void setResolution(String resolution) { this.resolution = resolution; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}

