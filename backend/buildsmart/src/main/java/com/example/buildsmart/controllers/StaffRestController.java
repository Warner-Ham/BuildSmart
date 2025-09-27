package com.example.buildsmart.controllers;

import com.example.buildsmart.dto.CreateStaffRequest;
import com.example.buildsmart.dto.StaffStatsResponse;
import com.example.buildsmart.dto.UpdateStaffRequest;
import com.example.buildsmart.model.Staff;
import com.example.buildsmart.model.StaffRole;
import com.example.buildsmart.model.StaffStatus;
import com.example.buildsmart.services.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST Controller for Staff Management
 * Provides API endpoints for React frontend integration
 */
@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class StaffRestController {

    private final StaffService staffService;

    @Autowired
    public StaffRestController(StaffService staffService){
        this.staffService = staffService;
        System.out.println("StaffRestController initialized - API endpoints ready");
    }

    /**
     * GET /api/staff - Get all staff members
     */
    @GetMapping
    public ResponseEntity<List<Staff>> getAllStaff(){
        try{
            List<Staff> staff = staffService.getAllStaff();
            System.out.println("GET /api/staff - Returning " + staff.size() + " staff members");
            return ResponseEntity.ok(staff);
        } catch (Exception e) {
            System.err.println("Error in getAllStaff: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/staff/{id} - Get staff member by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Staff> getStaffById(@PathVariable String id) {
        try {
            System.out.println("GET /api/staff/" + id);
            Optional<Staff> staff = staffService.getStaffById(id);

            if (staff.isPresent()) {
                System.out.println("Found staff: " + staff.get().getFullName());
                return ResponseEntity.ok(staff.get());
            } else {
                System.out.println("Staff not found with ID: " + id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error in getStaffById: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /api/staff - Create new staff member
     */
    @PostMapping
    public ResponseEntity<?> createStaff(@RequestBody CreateStaffRequest request) {
        try {
            System.out.println("POST /api/staff - Creating: " + request.toString());

            Staff newStaff = staffService.createStaff(
                    request.getFirstName(),
                    request.getLastName(),
                    request.getEmail(),
                    request.getPhoneNumber(),
                    request.getRole(),
                    request.getCreatedBy()
            );

            System.out.println("Staff created successfully: " + newStaff.getStaffId() + " - " + newStaff.getFullName());
            return ResponseEntity.status(HttpStatus.CREATED).body(newStaff);

        } catch (IllegalArgumentException e) {
            System.err.println("Validation error in createStaff: " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            System.err.println("Unexpected error in createStaff: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * PUT /api/staff/{id} - Update existing staff member
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStaff(@PathVariable String id,
                                         @RequestBody UpdateStaffRequest request) {
        try {
            System.out.println("PUT /api/staff/" + id + " - Updating: " + request.toString());

            Staff updatedStaff = staffService.updateStaff(
                    id,
                    request.getFirstName(),
                    request.getLastName(),
                    request.getEmail(),
                    request.getPhoneNumber(),
                    request.getRole()
            );

            System.out.println("Staff updated successfully: " + updatedStaff.getFullName());
            return ResponseEntity.ok(updatedStaff);

        } catch (IllegalArgumentException e) {
            System.err.println("Error in updateStaff: " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            System.err.println("Unexpected error in updateStaff: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * DELETE /api/staff/{id} - Delete staff member
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStaff(@PathVariable String id) {
        try {
            System.out.println("DELETE /api/staff/" + id);

            boolean deleted = staffService.deleteStaff(id);
            if (deleted) {
                System.out.println("Staff deleted successfully: " + id);
                Map<String, String> response = new HashMap<>();
                response.put("message", "Staff deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                System.out.println("Staff not found for deletion: " + id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error in deleteStaff: " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * GET /api/staff/search - Search staff with filters
     */
    @GetMapping("/search")
    public ResponseEntity<List<Staff>> searchStaff(
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) StaffRole role,
            @RequestParam(required = false) StaffStatus status) {

        try {
            System.out.println("GET /api/staff/search - firstName: " + firstName +
                    ", lastName: " + lastName + ", role: " + role + ", status: " + status);

            List<Staff> results = staffService.searchStaff(firstName, lastName, role, status);

            System.out.println("Search completed - Found " + results.size() + " results");
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            System.err.println("Error in searchStaff: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/staff/stats - Get staff statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<StaffStatsResponse> getStaffStats() {
        try {
            System.out.println("GET /api/staff/stats");

            StaffStatsResponse stats = staffService.getStaffStatistics();

            System.out.println("Stats retrieved: " + stats.toString());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("Error in getStaffStats: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/staff/role/{role} - Get staff by role
     */
    @GetMapping("/role/{role}")
    public ResponseEntity<List<Staff>> getStaffByRole(@PathVariable StaffRole role) {
        try {
            System.out.println("GET /api/staff/role/" + role);

            List<Staff> staffByRole = staffService.getStaffByRole(role);

            System.out.println("Found " + staffByRole.size() + " staff members with role: " + role);
            return ResponseEntity.ok(staffByRole);
        } catch (Exception e) {
            System.err.println("Error in getStaffByRole: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * PUT /api/staff/{id}/status - Change staff status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> changeStaffStatus(@PathVariable String id,
                                               @RequestParam StaffStatus status) {
        try {
            System.out.println("PUT /api/staff/" + id + "/status - New status: " + status);

            Staff updatedStaff = staffService.changeStaffStatus(id, status);

            System.out.println("Status changed successfully for: " + updatedStaff.getFullName());
            return ResponseEntity.ok(updatedStaff);
        } catch (IllegalArgumentException e) {
            System.err.println("Error in changeStaffStatus: " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            System.err.println("Unexpected error in changeStaffStatus: " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", System.currentTimeMillis());
        health.put("totalStaff", staffService.getTotalStaffCount());
        health.put("service", "Staff Management API");
        health.put("version", "1.0.0 - First 50%");

        System.out.println("Health check performed - System is UP");
        return ResponseEntity.ok(health);
    }
}
