package com.example.buildsmart.controllers;

import com.example.buildsmart.dto.StaffDTO;
import com.example.buildsmart.enums.StaffRole;
import com.example.buildsmart.enums.StaffStatus;
import com.example.buildsmart.services.StaffService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Staff REST Controller
 * Provides RESTful API endpoints for staff management
 */
@RestController
@RequestMapping("/api/v1/staff")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Staff Management", description = "APIs for managing construction staff members")
@CrossOrigin(origins = {"http://localhost:5713", "http://localhost:5173", "http://localhost:3000"})
public class StaffRestController {

    private final StaffService staffService;

    // CREATE OPERATIONS

    @PostMapping
    @Operation(summary = "Create new staff member", description = "Creates a new staff member in the system")
    public ResponseEntity<ApiResponse<StaffDTO.Response>> createStaff(
            @Valid @RequestBody StaffDTO.CreateRequest request) {
        log.info("POST /api/v1/staff - Creating staff: {}", request.getEmail());

        StaffDTO.Response response = staffService.createStaff(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Staff created successfully", response));
    }

    @PostMapping("/bulk")
    @Operation(summary = "Bulk create staff members", description = "Creates multiple staff members at once")
    public ResponseEntity<ApiResponse<List<StaffDTO.Response>>> createBulkStaff(
            @Valid @RequestBody List<StaffDTO.CreateRequest> requests) {
        log.info("POST /api/v1/staff/bulk - Creating {} staff members", requests.size());

        List<StaffDTO.Response> responses = staffService.createBulkStaff(requests);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Bulk staff created successfully", responses));
    }

    // READ OPERATIONS

    @GetMapping("/{id}")
    @Operation(summary = "Get staff by database ID", description = "Retrieves a staff member by their database ID")
    public ResponseEntity<ApiResponse<StaffDTO.Response>> getStaffById(
            @Parameter(description = "Database ID of the staff") @PathVariable Long id) {
        log.info("GET /api/v1/staff/{}", id);

        StaffDTO.Response response = staffService.getStaffById(id);

        return ResponseEntity.ok(ApiResponse.success("Staff retrieved successfully", response));
    }

    @GetMapping("/staff-id/{staffId}")
    @Operation(summary = "Get staff by Staff ID", description = "Retrieves a staff member by their unique staff ID")
    public ResponseEntity<ApiResponse<StaffDTO.Response>> getStaffByStaffId(
            @Parameter(description = "Unique staff ID") @PathVariable String staffId) {
        log.info("GET /api/v1/staff/staff-id/{}", staffId);

        StaffDTO.Response response = staffService.getStaffByStaffId(staffId);

        return ResponseEntity.ok(ApiResponse.success("Staff retrieved successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get all staff", description = "Retrieves all staff members with pagination")
    public ResponseEntity<ApiResponse<Page<StaffDTO.Response>>> getAllStaff(
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort by field") @RequestParam(defaultValue = "firstName") String sortBy,
            @Parameter(description = "Sort direction (asc/desc)") @RequestParam(defaultValue = "asc") String direction) {
        log.info("GET /api/v1/staff - page: {}, size: {}, sortBy: {}, direction: {}", page, size, sortBy, direction);

        Page<StaffDTO.Response> response = staffService.getAllStaff(page, size, sortBy, direction);

        return ResponseEntity.ok(ApiResponse.success("Staff list retrieved successfully", response));
    }

    @GetMapping("/active")
    @Operation(summary = "Get active staff", description = "Retrieves all active staff members")
    public ResponseEntity<ApiResponse<List<StaffDTO.Response>>> getActiveStaff() {
        log.info("GET /api/v1/staff/active");

        List<StaffDTO.Response> response = staffService.getActiveStaff();

        return ResponseEntity.ok(ApiResponse.success("Active staff retrieved successfully", response));
    }

    @GetMapping("/role/{role}")
    @Operation(summary = "Get staff by role", description = "Retrieves staff members by their role")
    public ResponseEntity<ApiResponse<List<StaffDTO.Response>>> getStaffByRole(
            @Parameter(description = "Staff role") @PathVariable StaffRole role) {
        log.info("GET /api/v1/staff/role/{}", role);

        List<StaffDTO.Response> response = staffService.getStaffByRole(role);

        return ResponseEntity.ok(ApiResponse.success("Staff by role retrieved successfully", response));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get staff by status", description = "Retrieves staff members by their status")
    public ResponseEntity<ApiResponse<List<StaffDTO.Response>>> getStaffByStatus(
            @Parameter(description = "Staff status") @PathVariable StaffStatus status) {
        log.info("GET /api/v1/staff/status/{}", status);

        List<StaffDTO.Response> response = staffService.getStaffByStatus(status);

        return ResponseEntity.ok(ApiResponse.success("Staff by status retrieved successfully", response));
    }

    @GetMapping("/search")
    @Operation(summary = "Search staff", description = "Searches staff by various criteria")
    public ResponseEntity<ApiResponse<Page<StaffDTO.Response>>> searchStaff(
            @Parameter(description = "General search term (searches across multiple fields)")
            @RequestParam(required = false) String searchTerm,
            @Parameter(description = "Filter by first name")
            @RequestParam(required = false) String firstName,
            @Parameter(description = "Filter by last name")
            @RequestParam(required = false) String lastName,
            @Parameter(description = "Filter by email")
            @RequestParam(required = false) String email,
            @Parameter(description = "Filter by phone number")
            @RequestParam(required = false) String phoneNumber,
            @Parameter(description = "Filter by role")
            @RequestParam(required = false) StaffRole role,
            @Parameter(description = "Filter by status")
            @RequestParam(required = false) StaffStatus status,
            @Parameter(description = "Page number (0-indexed)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort by field")
            @RequestParam(defaultValue = "firstName") String sortBy,
            @Parameter(description = "Sort direction (asc/desc)")
            @RequestParam(defaultValue = "asc") String sortDirection) {
        log.info("GET /api/v1/staff/search - term: {}, firstName: {}, lastName: {}, email: {}, role: {}, status: {}",
                searchTerm, firstName, lastName, email, role, status);

        StaffDTO.SearchCriteria criteria = StaffDTO.SearchCriteria.builder()
                .searchTerm(searchTerm)
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .phoneNumber(phoneNumber)
                .role(role)
                .status(status)
                .page(page)
                .size(size)
                .sortBy(sortBy)
                .sortDirection(sortDirection)
                .build();

        Page<StaffDTO.Response> response = staffService.searchStaff(criteria);

        return ResponseEntity.ok(ApiResponse.success("Search results retrieved successfully", response));
    }

    @GetMapping("/search/name")
    @Operation(summary = "Search staff by name", description = "Searches staff by first and/or last name")
    public ResponseEntity<ApiResponse<List<StaffDTO.Response>>> searchStaffByName(
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName) {
        log.info("GET /api/v1/staff/search/name - firstName: {}, lastName: {}", firstName, lastName);

        List<StaffDTO.Response> response = staffService.searchStaffByName(firstName, lastName);

        return ResponseEntity.ok(ApiResponse.success("Search results retrieved successfully", response));
    }

    // UPDATE OPERATIONS

    @PutMapping("/{id}")
    @Operation(summary = "Update staff", description = "Updates staff member information")
    public ResponseEntity<ApiResponse<StaffDTO.Response>> updateStaff(
            @Parameter(description = "Database ID of the staff") @PathVariable Long id,
            @Valid @RequestBody StaffDTO.UpdateRequest request) {
        log.info("PUT /api/v1/staff/{} - Updating staff", id);

        StaffDTO.Response response = staffService.updateStaff(id, request);

        return ResponseEntity.ok(ApiResponse.success("Staff updated successfully", response));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Change staff status", description = "Changes the status of a staff member")
    public ResponseEntity<ApiResponse<StaffDTO.Response>> changeStaffStatus(
            @Parameter(description = "Database ID of the staff") @PathVariable Long id,
            @Valid @RequestBody StaffDTO.StatusChangeRequest request) {
        log.info("PATCH /api/v1/staff/{}/status - Changing status to: {}", id, request.getNewStatus());

        StaffDTO.Response response = staffService.changeStaffStatus(id, request);

        return ResponseEntity.ok(ApiResponse.success("Staff status changed successfully", response));
    }

    @PatchMapping("/staff-id/{staffId}/login")
    @Operation(summary = "Update last login", description = "Updates the last login timestamp for a staff member")
    public ResponseEntity<ApiResponse<Void>> updateLastLogin(
            @Parameter(description = "Unique staff ID") @PathVariable String staffId) {
        log.info("PATCH /api/v1/staff/staff-id/{}/login", staffId);

        staffService.updateLastLogin(staffId);

        return ResponseEntity.ok(ApiResponse.success("Last login updated successfully", null));
    }

    // DELETE OPERATIONS

    @DeleteMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate staff", description = "Soft deletes a staff member (can be reactivated)")
    public ResponseEntity<ApiResponse<Void>> deactivateStaff(
            @Parameter(description = "Database ID of the staff") @PathVariable Long id,
            @Parameter(description = "Username of person performing deactivation")
            @RequestParam(required = false) String deactivatedBy) {
        log.info("DELETE /api/v1/staff/{}/deactivate by {}", id, deactivatedBy);

        staffService.deactivateStaff(id, deactivatedBy != null ? deactivatedBy : "SYSTEM");

        return ResponseEntity.ok(ApiResponse.success("Staff deactivated successfully", null));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete staff permanently", description = "Permanently deletes a staff member")
    public ResponseEntity<ApiResponse<Void>> deleteStaff(
            @Parameter(description = "Database ID of the staff") @PathVariable Long id,
            @Parameter(description = "Username of person performing deletion")
            @RequestParam(required = false) String deletedBy) {
        log.info("DELETE /api/v1/staff/{} by {}", id, deletedBy);

        staffService.deleteStaff(id, deletedBy != null ? deletedBy : "SYSTEM");

        return ResponseEntity.ok(ApiResponse.success("Staff deleted successfully", null));
    }

    @PostMapping("/bulk-deactivate")
    @Operation(summary = "Bulk deactivate staff", description = "Deactivates multiple staff members at once")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> bulkDeactivateStaff(
            @RequestBody List<Long> ids,
            @RequestParam(required = false) String deactivatedBy) {
        log.info("POST /api/v1/staff/bulk-deactivate - {} staff members by {}", ids.size(), deactivatedBy);

        int count = staffService.bulkDeactivateStaff(ids, deactivatedBy != null ? deactivatedBy : "SYSTEM");

        return ResponseEntity.ok(ApiResponse.success(
                "Bulk deactivation completed",
                Map.of("deactivatedCount", count, "totalRequested", ids.size())
        ));
    }

    //  STATISTICS

    @GetMapping("/statistics")
    @Operation(summary = "Get staff statistics", description = "Retrieves comprehensive staff statistics")
    public ResponseEntity<ApiResponse<StaffDTO.Statistics>> getStatistics() {
        log.info("GET /api/v1/staff/statistics");

        StaffDTO.Statistics response = staffService.getStatistics();

        return ResponseEntity.ok(ApiResponse.success("Statistics retrieved successfully", response));
    }

    // UTILITY ENDPOINTS

    @GetMapping("/roles")
    @Operation(summary = "Get all roles", description = "Retrieves all available staff roles")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getAllRoles() {
        log.info("GET /api/v1/staff/roles");

        List<Map<String, String>> roles = java.util.Arrays.stream(StaffRole.values())
                .map(role -> Map.of(
                        "name", role.name(),
                        "displayName", role.getDisplayName(),
                        "description", role.getDescription()
                ))
                .toList();

        return ResponseEntity.ok(ApiResponse.success("Roles retrieved successfully", roles));
    }

    @GetMapping("/statuses")
    @Operation(summary = "Get all statuses", description = "Retrieves all available staff statuses")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getAllStatuses() {
        log.info("GET /api/v1/staff/statuses");

        List<Map<String, String>> statuses = java.util.Arrays.stream(StaffStatus.values())
                .map(status -> Map.of(
                        "name", status.name(),
                        "displayName", status.getDisplayName(),
                        "description", status.getDescription()
                ))
                .toList();

        return ResponseEntity.ok(ApiResponse.success("Statuses retrieved successfully", statuses));
    }

    // HEALTH CHECK

    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Checks if the staff API is running")
    public ResponseEntity<ApiResponse<Map<String, String>>> healthCheck() {
        log.debug("GET /api/v1/staff/health");

        return ResponseEntity.ok(ApiResponse.success(
                "Staff API is healthy",
                Map.of(
                        "status", "UP",
                        "service", "Staff Management API",
                        "timestamp", String.valueOf(System.currentTimeMillis())
                )
        ));
    }

    // API RESPONSE WRAPPER

    /**
     * Standard API Response wrapper
     */
    @lombok.Data
    @lombok.AllArgsConstructor
    @lombok.NoArgsConstructor
    @lombok.Builder
    public static class ApiResponse<T> {
        private boolean success;
        private String message;
        private T data;
        private Long timestamp;

        public static <T> ApiResponse<T> success(String message, T data) {
            return ApiResponse.<T>builder()
                    .success(true)
                    .message(message)
                    .data(data)
                    .timestamp(System.currentTimeMillis())
                    .build();
        }

        public static <T> ApiResponse<T> error(String message) {
            return ApiResponse.<T>builder()
                    .success(false)
                    .message(message)
                    .data(null)
                    .timestamp(System.currentTimeMillis())
                    .build();
        }

        public static <T> ApiResponse<T> error(String message, T data) {
            return ApiResponse.<T>builder()
                    .success(false)
                    .message(message)
                    .data(data)
                    .timestamp(System.currentTimeMillis())
                    .build();
        }
    }
}