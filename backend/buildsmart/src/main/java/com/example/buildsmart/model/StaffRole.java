package com.example.buildsmart.model;

public class StaffRole {
    ADMIN("Admin", "Full system access"),
    SITE_ENGINEER("Site Engineer", "Project and site management"),
    DOCUMENT_CONTROL_MANAGER("Document Control Manager", "Document oversight"),
    SITE_STAFF("Site Staff", "Basic site operations"),
    BUDGET_PLANNING_TEAM("Budget Planning Team", "Budget analysis and planning");

    private final String displayName;
    private final String description;

    StaffRole(String displayName, String description){
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
