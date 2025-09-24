package com.example.buildsmart.dto;

import com.example.buildsmart.model.StaffRole;

/**
 * Data transfer object for updating existing staff members
 */
public class UpdateStaffRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private StaffRole role;

    // Default constructor
    public UpdateStaffRequest() {}

    // Getters and Setters
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public StaffRole getRole() { return role; }
    public void setRole(StaffRole role) { this.role = role; }

    @Override
    public String toString() {
        return "UpdateStaffRequest{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", role=" + role +
                '}';
    }
}
