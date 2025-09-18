package com.example.buildsmart.model;

public class StaffStatus {
    ACTIVE("Active", "Staff member is currently active and can access the system."),
    INACTIVE("Inactive","Staff member id temporarily inactive.")
    SUSPENDED("Suspended", "Staff member has been suspended from system access")
    PENDING_ACTIVATION("Pending Activation", "New staff member awaiting activation");

    private final String displayName;
    private final String description;

    StaffStatus(String displayName, String description){
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName(){
        return displayName;
    }

    public String getDescription(){
        return description;
    }

    @Override
    public String toString(){
        return displayName;
    }

}
