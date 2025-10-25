package com.example.buildsmart.enums;

import lombok.Getter;

/**
 * Staff Role Enumeration
 */
@Getter
public enum StaffRole {
    ADMIN("Admin", "Full system access and user management"),
    SITE_MANAGER("Site Manager", "Site management responsibilities"),
    DOCUMENT_CONTROL_MANAGER("Document Control Manager", "Document oversight and control"),
    PROJECT_MANAGER("Project Manager", "Project management responsibilities");

    private final String displayName;
    private final String description;

    StaffRole(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }
}
