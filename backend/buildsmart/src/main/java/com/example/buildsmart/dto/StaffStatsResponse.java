package com.example.buildsmart.dto;

/**
 * Data transfer object for staff statistics
 */
public class StaffStatsResponse {
    private long totalStaff;
    private long activeStaff;
    private long adminCount;
    private long engineerCount;

    //Default constructor
    public StaffStatsResponse(){}

    // Parameterized constructor
    public StaffStatsResponse(long totalStaff, long activeStaff, long adminCount, long engineerCount) {
        this.totalStaff = totalStaff;
        this.activeStaff = activeStaff;
        this.adminCount = adminCount;
        this.engineerCount = engineerCount;
    }

    //Getters and Setters
    public long getTotalStaff() { return totalStaff; }
    public void setTotalStaff(long totalStaff) { this.totalStaff = totalStaff; }

    public long getActiveStaff() { return activeStaff; }
    public void setActiveStaff(long activeStaff) { this.activeStaff = activeStaff; }

    public long getAdminCount() { return adminCount; }
    public void setAdminCount(long adminCount) { this.adminCount = adminCount; }

    public long getEngineerCount() { return engineerCount; }
    public void setEngineerCount(long engineerCount) { this.engineerCount = engineerCount; }

    @Override
    public String toString() {
        return "StaffStatsResponse{" +
                "totalStaff=" + totalStaff +
                ", activeStaff=" + activeStaff +
                ", adminCount=" + adminCount +
                ", engineerCount=" + engineerCount +
                '}';
    }
}
