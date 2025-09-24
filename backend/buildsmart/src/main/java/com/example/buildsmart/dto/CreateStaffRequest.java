package com.example.buildsmart.dto;

import com.example.buildsmart.model.StaffRole;

/**
 * Data transfer object for creating new staff members
 */
public class CreateStaffRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private StaffRole role;
    private String createdBy;

    // Default constructor
    public CreateStaffRequest(){}

    // Parameterized constructor
    public CreateStaffRequest(String firstName, String lastName, String email,
                              String phoneNumber, StaffRole role, String createdBy) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.createdBy = createdBy;
    }

    // Getters and Setters
    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public StaffRole getRole() {
        return role;
    }
    public void setRole(StaffRole role) {
        this.role = role;
    }

    public String getCreatedBy() {
        return createdBy;
    }
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    @Override
    public String toString() {
        return "CreateStaffRequest{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", role=" + role +
                '}';
    }
}
