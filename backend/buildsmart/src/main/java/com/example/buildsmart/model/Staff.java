package com.example.buildsmart.model;

import java.time.LocalDateTime;

public class Staff {
    private String staffId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private StaffRole role;
    private StaffStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    private String createdBy;

    //Default constructor
    public Staff() {
        this.staffId = generateUniqueId();
        this.createAt = LocalDateTime.now();
        this.status = StaffStatus.ACTIVE;
    }

    //Parameterized constructor
    public Staff(String firstName, String lastName, String email, String phoneNumber, StaffRole role, String createdBy){
        this();
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.createdBy = createdBy;
    }

    //Getters and Setters
    public String getStaffId(){
        return staffId;
    }

    public void setStaffId(String staffId){
        this.staffId = staffId;
    }

    public String getFirstName(){
        return firstName;
    }

    public void setFirstName(String firstName){
        this.firstName = firstName;
    }

    public String getLastName(){
        return lastName;
    }

    public void setLastName(String lastName){
        this.lastName = lastName;
    }

    public String getEmail(){
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber(){
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber){
        this.phoneNumber = phoneNumber;
    }

    public StaffRole getRole(){
        return role;
    }

    public void setRole(StaffRole role){
        this.role = role;
    }

    public StaffStatus getStatus() {
        return status;
    }

    public void setStatus(StaffStatus status){
        this.status = status;
    }

    public LocalDateTime getCreatedAt(){
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

}
