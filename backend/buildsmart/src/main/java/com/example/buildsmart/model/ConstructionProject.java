package com.example.buildsmart.model;

public class ConstructionProject {
    private String name;
    private String status;
    private String location;

    public ConstructionProject(String name, String status, String location) {
        this.name = name;
        this.status = status;
        this.location = location;
    }

    public String getName() { return name; }
    public String getStatus() { return status; }
    public String getLocation() { return location; }

    public void setName(String name) { this.name = name; }
    public void setStatus(String status) { this.status = status; }
    public void setLocation(String location) { this.location = location; }
}
