package com.example.buildsmart.services;

import com.example.buildsmart.dto.StaffStatsResponse;
import com.example.buildsmart.model.Staff;
import com.example.buildsmart.model.StaffRole;
import com.example.buildsmart.model.StaffStatus;
import com.example.buildsmart.repositories.StaffRepository;
import com.example.buildsmart.utils.ValidationUtils;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Staff Service Layer
 * Contains business logic for staff management operations
 */
@Service
public class StaffService {
    private final StaffRepository staffRepository;

    @Autowired
    public StaffService(StaffRepository staffRepository){
        this.staffRepository = staffRepository;
        System.out.println("StaffService initialized");
    }

    @PostConstruct
    public void initializeSampleData() {
        System.out.println("Initializing sample staff data...");

        Staff admin = new Staff("John", "Doe", "john.doe@construction.com",
                "+1234567890", StaffRole.ADMIN, "SYSTEM");
        Staff siteEngineer = new Staff("Jane", "Smith", "jane.smith@construction.com",
                "+1234567891", StaffRole.SITE_ENGINEER, admin.getStaffId());
        Staff documentManager = new Staff("Mike", "Johnson", "mike.johnson@construction.com",
                "+1234567892", StaffRole.DOCUMENT_CONTROL_MANAGER, admin.getStaffId());
        Staff siteStaff = new Staff("Sarah", "Wilson", "sarah.wilson@construction.com",
                "+1234567893", StaffRole.SITE_STAFF, admin.getStaffId());
        Staff budgetTeam = new Staff("Tom", "Brown", "tom.brown@construction.com",
                "+1234567894", StaffRole.BUDGET_PLANNING_TEAM, admin.getStaffId());

        staffRepository.save(admin);
        staffRepository.save(siteEngineer);
        staffRepository.save(documentManager);
        staffRepository.save(siteStaff);
        staffRepository.save(budgetTeam);

        System.out.println("Sample data initialized: " + staffRepository.count() + " staff members");
    }

    // CREATE operations
    public Staff createStaff(String firstName, String lastName, String email,
                             String phoneNumber, StaffRole role, String createdBy){
        //Validation using ValidationUtils
        validateStaffData(firstName, lastName, email, phoneNumber);

        if (staffRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Staff with email already exists: " + email);
        }

        Staff newStaff = new Staff(firstName, lastName, email, phoneNumber, role, createdBy);
        return staffRepository.save(newStaff);
    }

    // READ operations
    public Optional<Staff> getStaffById(String staffId) {
        return staffRepository.findById(staffId);
    }

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    public List<Staff> getActiveStaff() {
        return staffRepository.findByStatus(StaffStatus.ACTIVE);
    }

    public List<Staff> getStaffByRole(StaffRole role) {
        return staffRepository.findByRole(role);
    }

    // UPDATE operations
    public Staff updateStaff(String staffId, String firstName, String lastName,
                             String email, String phoneNumber, StaffRole role) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new IllegalArgumentException("Staff not found: " + staffId));

        // Validate and update fields if provided
        if (firstName != null && ValidationUtils.isValidName(firstName)) {
            staff.setFirstName(firstName);
        }
        if (lastName != null && ValidationUtils.isValidName(lastName)) {
            staff.setLastName(lastName);
        }
        if (email != null && ValidationUtils.isValidEmail(email)) {
            if (staffRepository.findByEmail(email).isPresent() &&
                    !staffRepository.findByEmail(email).get().getStaffId().equals(staffId)) {
                throw new IllegalArgumentException("Email already in use: " + email);
            }
            staff.setEmail(email);
        }
        if (phoneNumber != null && ValidationUtils.isValidPhoneNumber(phoneNumber)) {
            staff.setPhoneNumber(phoneNumber);
        }
        if (role != null) {
            staff.setRole(role);
        }

        return staffRepository.save(staff);
    }

    public Staff changeStaffStatus(String staffId, StaffStatus newStatus) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new IllegalArgumentException("Staff not found: " + staffId));

        staff.setStatus(newStatus);
        return staffRepository.save(staff);
    }

    //DELETE operations
    public boolean deactivateStaff(String staffId){
        Optional<Staff> staff = staffRepository.findById(staffId);
        if(staff.isPresent()){
            staff.get().setStatus(StaffStatus.INACTIVE);
            staffRepository.save(staff.get());
            return true;
        }
        return false;
    }

    public boolean deleteStaff(String staffId){
        return staffRepository.delete(staffId);
    }

    //SEARCH operations
    public List<Staff> searchStaff(String firstName, String lastName, StaffRole role, StaffStatus status) {
        List<Staff> results = staffRepository.findAll();

        if (firstName != null && !firstName.trim().isEmpty()) {
            results = results.stream()
                    .filter(staff -> staff.getFirstName().toLowerCase().contains(firstName.toLowerCase()))
                    .collect(java.util.stream.Collectors.toList());
        }

        if (lastName != null && !lastName.trim().isEmpty()) {
            results = results.stream()
                    .filter(staff -> staff.getLastName().toLowerCase().contains(lastName.toLowerCase()))
                    .collect(java.util.stream.Collectors.toList());
        }

        if (role != null) {
            results = results.stream()
                    .filter(staff -> staff.getRole() == role)
                    .collect(java.util.stream.Collectors.toList());
        }

        if (status != null) {
            results = results.stream()
                    .filter(staff -> staff.getStatus() == status)
                    .collect(java.util.stream.Collectors.toList());
        }

        return results;
    }

    // STATISTICS operations
    public StaffStatsResponse getStaffStatistics(){
        long totalStaff = staffRepository.count();
        long activeStaff = staffRepository.findByStatus(StaffStatus.ACTIVE).size();
        long adminCount = staffRepository.findByRole(StaffRole.ADMIN).size();
        long engineerCount = staffRepository.findByRole(StaffRole.SITE_ENGINEER).size();

        return new StaffStatsResponse(totalStaff, activeStaff, adminCount, engineerCount);
    }

    // Validation helper
    private void validateStaffData(String firstName, String lastName,
                                   String email, String phoneNumber) {
        if (!ValidationUtils.isValidName(firstName)) {
            throw new IllegalArgumentException("Invalid first name");
        }
        if (!ValidationUtils.isValidName(lastName)) {
            throw new IllegalArgumentException("Invalid last name");
        }
        if (!ValidationUtils.isValidEmail(email)) {
            throw new IllegalArgumentException("Invalid email format");
        }
        if (!ValidationUtils.isValidPhoneNumber(phoneNumber)) {
            throw new IllegalArgumentException("Invalid phone number");
        }
    }

    // Utility methods
    public long getTotalStaffCount(){
        return staffRepository.count();
    }

    public boolean emailExists(String email){
        return staffRepository.findByEmail(email).isPresent();
    }
}
