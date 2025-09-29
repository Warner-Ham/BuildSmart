package com.example.buildsmart.dto;

import java.util.Map;
import java.util.List;

public class ProgressResponseDTO {
    private Long projectId;
    private String projectName;
    private Double completionPercentage;
    private Map<String, Object> summary;
    private List<Map<String, Object>> graphData;

    // Constructors
    public ProgressResponseDTO() {}

    public ProgressResponseDTO(Long projectId, String projectName, Double completionPercentage) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.completionPercentage = completionPercentage;
    }

    // Getters and setters
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
    public Double getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(Double completionPercentage) { this.completionPercentage = completionPercentage; }
    public Map<String, Object> getSummary() { return summary; }
    public void setSummary(Map<String, Object> summary) { this.summary = summary; }
    public List<Map<String, Object>> getGraphData() { return graphData; }
    public void setGraphData(List<Map<String, Object>> graphData) { this.graphData = graphData; }
}