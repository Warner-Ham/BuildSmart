package com.example.buildsmart.enums;

import lombok.Getter;

/**
 * Staff Status Enumeration
 */
@Getter
public enum StaffStatus {
    ACTIVE("Active", "Staff member is currently active and can access the system"),
    INACTIVE("Inactive", "Staff member is temporarily inactive"),
    SUSPENDED("Suspended", "Staff member has been suspended from system access"),
    PENDING_ACTIVATION("Pending Activation", "New staff member awaiting activation");

    private final String displayName;
    private final String description;

    // Constructor - note: no access modifier for enum constructors
    StaffStatus(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }
}
