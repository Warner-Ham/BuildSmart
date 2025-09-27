// Staff roles mapping (matching Java enum)
export const StaffRole = {
    ADMIN: { displayName: "Admin", description: "Full system access and user management" },
    SITE_ENGINEER: { displayName: "Site Engineer", description: "Project and site management responsibilities" },
    DOCUMENT_CONTROL_MANAGER: { displayName: "Document Control Manager", description: "Document oversight and control" },
    SITE_STAFF: { displayName: "Site Staff", description: "Basic site operations and daily tasks" },
    BUDGET_PLANNING_TEAM: { displayName: "Budget Planning Team", description: "Budget analysis and planning" }
};

// Staff status mapping (matching Java enum)
export const StaffStatus = {
    ACTIVE: { displayName: "Active", description: "Staff member is currently active and can access the system" },
    INACTIVE: { displayName: "Inactive", description: "Staff member is temporarily inactive" },
    SUSPENDED: { displayName: "Suspended", description: "Staff member has been suspended from system access" },
    PENDING_ACTIVATION: { displayName: "Pending Activation", description: "New staff member awaiting activation" }
};

/**
 * Staff class matching Java backend Staff.java
 */
class Staff {
    constructor(firstName = '', lastName = '', email = '', phoneNumber = '', role = '', createdBy = '') {
        this.staffId = this.generateUniqueId();
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.status = 'ACTIVE';
        this.createdAt = new Date();
        this.lastLogin = null;
        this.createdBy = createdBy;
    }

    generateUniqueId() {
        return 'STAFF' + Date.now();
    }

    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    isActive() {
        return this.status === 'ACTIVE';
    }

    toString() {
        return `Staff{staffId='${this.staffId}', fullName='${this.getFullName()}', email='${this.email}', role=${this.role}, status=${this.status}, createdAt=${this.createdAt.toISOString()}}`;
    }

    // Java-style getters and setters
    getStaffId() { return this.staffId; }
    setStaffId(staffId) { this.staffId = staffId; }

    getFirstName() { return this.firstName; }
    setFirstName(firstName) { this.firstName = firstName; }

    getLastName() { return this.lastName; }
    setLastName(lastName) { this.lastName = lastName; }

    getEmail() { return this.email; }
    setEmail(email) { this.email = email; }

    getPhoneNumber() { return this.phoneNumber; }
    setPhoneNumber(phoneNumber) { this.phoneNumber = phoneNumber; }

    getRole() { return this.role; }
    setRole(role) { this.role = role; }

    getStatus() { return this.status; }
    setStatus(status) { this.status = status; }

    getCreatedAt() { return this.createdAt; }
    setCreatedAt(createdAt) { this.createdAt = createdAt; }

    getCreatedBy() { return this.createdBy; }
    setCreatedBy(createdBy) { this.createdBy = createdBy; }
}

export default Staff;