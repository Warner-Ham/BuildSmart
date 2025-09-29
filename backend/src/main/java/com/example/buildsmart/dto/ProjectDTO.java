package com.example.buildsmart.dto;

import java.time.LocalDate;

public class ProjectDTO {
    private Long id;
    private String name;
    private String client;
    private String location;
    private String status;
    private String images;

    // Constructors
    public ProjectDTO() {}

    // Constructor from Entity
    public ProjectDTO(Long id, String name, String client, String location, String status, String images) {
        this.id = id;
        this.name = name;
        this.client = client;
        this.location = location;
        this.status = status;
        this.images = images;
    }

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
}
