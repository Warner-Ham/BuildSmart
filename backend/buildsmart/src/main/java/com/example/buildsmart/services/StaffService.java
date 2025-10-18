package com.example.buildsmart.services;

import com.example.buildsmart.dto.StaffDTO;
import com.example.buildsmart.entity.Staff;
import com.example.buildsmart.enums.StaffStatus;
import com.example.buildsmart.enums.StaffRole;
import com.example.buildsmart.entity.AuditLog;
import com.example.buildsmart.exception.DuplicateEmailException;
import com.example.buildsmart.exception.ResourceNotFoundException;
import com.example.buildsmart.repositories.AuditLogRepository;
import com.example.buildsmart.repositories.StaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Staff Service - Spring Boot Service Layer
 * Handles business logic for staff management
 */
@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class StaffService {

    private final StaffRepository staffRepository;
    private final AuditLogRepository auditLogRepository;
    private final ModelMapper modelMapper;

    // ==================== CREATE OPERATIONS ====================

    /**
     * Create new staff member
     */
    public StaffDTO.Response createStaff(StaffDTO.CreateRequest request) {
        log.info("Creating new staff: {}", request.getEmail());

        // Check for duplicate email
        if (staffRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already exists: " + request.getEmail());
        }

        // Create staff entity
        Staff staff = Staff.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole())
                .status(StaffStatus.ACTIVE)
                .createdBy(request.getCreatedBy() != null ? request.getCreatedBy() : "SYSTEM")
                .build();

        Staff savedStaff = staffRepository.save(staff);

        // Create audit log
        createAuditLog("CREATE", savedStaff.getStaffId(),
                "Staff created: " + savedStaff.getFullName(),
                savedStaff.getCreatedBy());

        log.info("Staff created successfully: {}", savedStaff.getStaffId());
        return mapToResponse(savedStaff);
    }

    /**
     * Bulk create staff members
     */
    public List<StaffDTO.Response> createBulkStaff(List<StaffDTO.CreateRequest> requests) {
        log.info("Bulk creating {} staff members", requests.size());

        List<Staff> staffList = requests.stream()
                .filter(req -> !staffRepository.existsByEmail(req.getEmail()))
                .map(req -> Staff.builder()
                        .firstName(req.getFirstName())
                        .lastName(req.getLastName())
                        .email(req.getEmail())
                        .phoneNumber(req.getPhoneNumber())
                        .role(req.getRole())
                        .status(StaffStatus.ACTIVE)
                        .createdBy(req.getCreatedBy() != null ? req.getCreatedBy() : "SYSTEM")
                        .build())
                .collect(Collectors.toList());

        List<Staff> savedStaff = staffRepository.saveAll(staffList);

        // Create audit log
        createAuditLog("BULK_CREATE", "SYSTEM",
                "Bulk created " + savedStaff.size() + " staff members",
                "SYSTEM");

        log.info("Bulk created {} staff members", savedStaff.size());
        return savedStaff.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ==================== READ OPERATIONS ====================

    /**
     * Get staff by ID
     */
    @Transactional(readOnly = true)
    public StaffDTO.Response getStaffById(Long id) {
        log.info("Fetching staff by ID: {}", id);
        Staff staff = findStaffById(id);
        return mapToResponse(staff);
    }

    /**
     * Get staff by staff ID
     */
    @Transactional(readOnly = true)
    public StaffDTO.Response getStaffByStaffId(String staffId) {
        log.info("Fetching staff by staff ID: {}", staffId);
        Staff staff = staffRepository.findByStaffId(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found: " + staffId));
        return mapToResponse(staff);
    }

    /**
     * Get all staff with pagination
     */
    @Transactional(readOnly = true)
    public Page<StaffDTO.Response> getAllStaff(int page, int size, String sortBy, String direction) {
        log.info("Fetching all staff - page: {}, size: {}", page, size);

        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        return staffRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    /**
     * Get active staff
     */
    @Transactional(readOnly = true)
    public List<StaffDTO.Response> getActiveStaff() {
        log.info("Fetching active staff");
        return staffRepository.findByStatus(StaffStatus.ACTIVE).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get staff by role
     */
    @Transactional(readOnly = true)
    public List<StaffDTO.Response> getStaffByRole(StaffRole role) {
        log.info("Fetching staff by role: {}", role);
        return staffRepository.findByRole(role).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get staff by status
     */
    @Transactional(readOnly = true)
    public List<StaffDTO.Response> getStaffByStatus(StaffStatus status) {
        log.info("Fetching staff by status: {}", status);
        return staffRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Search staff by name
     */
    @Transactional(readOnly = true)
    public List<StaffDTO.Response> searchStaffByName(String firstName, String lastName) {
        log.info("Searching staff - firstName: {}, lastName: {}", firstName, lastName);
        return staffRepository.findByFirstNameAndLastName(firstName, lastName).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Search staff with criteria
     */
    @Transactional(readOnly = true)
    public Page<StaffDTO.Response> searchStaff(StaffDTO.SearchCriteria criteria) {
        log.info("Searching staff with criteria: {}", criteria);

        Pageable pageable = PageRequest.of(
                criteria.getPage() != null ? criteria.getPage() : 0,
                criteria.getSize() != null ? criteria.getSize() : 20,
                Sort.by(Sort.Direction.fromString(
                                criteria.getSortDirection() != null ? criteria.getSortDirection() : "ASC"),
                        criteria.getSortBy() != null ? criteria.getSortBy() : "firstName")
        );

        return staffRepository.findWithCriteria(
                criteria.getRole(),
                criteria.getStatus(),
                criteria.getSearchTerm(),
                pageable
        ).map(this::mapToResponse);
    }

    // ==================== UPDATE OPERATIONS ====================

    /**
     * Update staff information
     */
    public StaffDTO.Response updateStaff(Long id, StaffDTO.UpdateRequest request) {
        log.info("Updating staff ID: {}", id);

        Staff staff = findStaffById(id);
        StringBuilder changes = new StringBuilder("Updated: ");

        if (request.getFirstName() != null) {
            staff.setFirstName(request.getFirstName());
            changes.append("firstName, ");
        }

        if (request.getLastName() != null) {
            staff.setLastName(request.getLastName());
            changes.append("lastName, ");
        }

        if (request.getEmail() != null && !request.getEmail().equals(staff.getEmail())) {
            if (staffRepository.existsByEmail(request.getEmail())) {
                throw new DuplicateEmailException("Email already in use: " + request.getEmail());
            }
            staff.setEmail(request.getEmail());
            changes.append("email, ");
        }

        if (request.getPhoneNumber() != null) {
            staff.setPhoneNumber(request.getPhoneNumber());
            changes.append("phoneNumber, ");
        }

        if (request.getRole() != null) {
            staff.setRole(request.getRole());
            changes.append("role, ");
        }

        Staff updatedStaff = staffRepository.save(staff);

        // Create audit log
        createAuditLog("UPDATE", staff.getStaffId(), changes.toString(),
                request.getUpdatedBy() != null ? request.getUpdatedBy() : "SYSTEM");

        log.info("Staff updated successfully: {}", updatedStaff.getStaffId());
        return mapToResponse(updatedStaff);
    }

    /**
     * Change staff status
     */
    public StaffDTO.Response changeStaffStatus(Long id, StaffDTO.StatusChangeRequest request) {
        log.info("Changing status for staff ID: {}", id);

        Staff staff = findStaffById(id);
        StaffStatus oldStatus = staff.getStatus();
        staff.setStatus(request.getNewStatus());

        Staff updatedStaff = staffRepository.save(staff);

        // Create audit log
        String description = String.format("Status changed from %s to %s", oldStatus, request.getNewStatus());
        if (request.getReason() != null) {
            description += ". Reason: " + request.getReason();
        }
        createAuditLog("STATUS_CHANGE", staff.getStaffId(), description,
                request.getUpdatedBy() != null ? request.getUpdatedBy() : "SYSTEM");

        log.info("Staff status changed: {} -> {}", oldStatus, request.getNewStatus());
        return mapToResponse(updatedStaff);
    }

    /**
     * Update last login
     */
    public void updateLastLogin(String staffId) {
        log.info("Updating last login for: {}", staffId);

        Staff staff = staffRepository.findByStaffId(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found: " + staffId));

        staff.updateLastLogin();
        staffRepository.save(staff);

        createAuditLog("LOGIN", staffId, "Staff logged in", staffId);
    }

    // ==================== DELETE OPERATIONS ====================

    /**
     * Deactivate staff (soft delete)
     */
    public void deactivateStaff(Long id, String deactivatedBy) {
        log.info("Deactivating staff ID: {}", id);

        Staff staff = findStaffById(id);
        staff.setStatus(StaffStatus.INACTIVE);
        staffRepository.save(staff);

        createAuditLog("DEACTIVATE", staff.getStaffId(),
                "Staff deactivated: " + staff.getFullName(), deactivatedBy);

        log.info("Staff deactivated: {}", staff.getStaffId());
    }

    /**
     * Delete staff permanently
     */
    public void deleteStaff(Long id, String deletedBy) {
        log.info("Deleting staff ID: {}", id);

        Staff staff = findStaffById(id);
        String staffId = staff.getStaffId();
        String fullName = staff.getFullName();

        staffRepository.delete(staff);

        createAuditLog("DELETE", staffId,
                "Staff permanently deleted: " + fullName, deletedBy);

        log.info("Staff permanently deleted: {}", staffId);
    }

    /**
     * Bulk deactivate staff
     */
    public int bulkDeactivateStaff(List<Long> ids, String deactivatedBy) {
        log.info("Bulk deactivating {} staff members", ids.size());

        int count = 0;
        for (Long id : ids) {
            try {
                deactivateStaff(id, deactivatedBy);
                count++;
            } catch (Exception e) {
                log.error("Failed to deactivate staff ID: {}", id, e);
            }
        }

        createAuditLog("BULK_DEACTIVATE", "SYSTEM",
                "Deactivated " + count + " staff members", deactivatedBy);

        log.info("Bulk deactivated {} staff members", count);
        return count;
    }

    // ==================== STATISTICS ====================

    /**
     * Get staff statistics
     */
    @Transactional(readOnly = true)
    public StaffDTO.Statistics getStatistics() {
        log.info("Fetching staff statistics");

        long total = staffRepository.count();
        long active = staffRepository.countByStatus(StaffStatus.ACTIVE);
        long inactive = staffRepository.countByStatus(StaffStatus.INACTIVE);
        long suspended = staffRepository.countByStatus(StaffStatus.SUSPENDED);
        long pending = staffRepository.countByStatus(StaffStatus.PENDING_ACTIVATION);

        // Get staff count by role
        Map<StaffRole, Long> byRole = staffRepository.getStaffCountByRole().stream()
                .collect(Collectors.toMap(
                        arr -> (StaffRole) arr[0],
                        arr -> (Long) arr[1]
                ));

        // Get staff count by status
        Map<StaffStatus, Long> byStatus = staffRepository.getStaffCountByStatus().stream()
                .collect(Collectors.toMap(
                        arr -> (StaffStatus) arr[0],
                        arr -> (Long) arr[1]
                ));

        return StaffDTO.Statistics.builder()
                .totalStaff(total)
                .activeStaff(active)
                .inactiveStaff(inactive)
                .suspendedStaff(suspended)
                .pendingActivation(pending)
                .staffByRole(byRole)
                .staffByStatus(byStatus)
                .build();
    }

    // ==================== HELPER METHODS ====================

    private Staff findStaffById(Long id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with ID: " + id));
    }

    private void createAuditLog(String action, String staffId, String description, String performedBy) {
        AuditLog auditLog = AuditLog.create(action, staffId, description, performedBy);
        auditLogRepository.save(auditLog);
    }

    private StaffDTO.Response mapToResponse(Staff staff) {
        return StaffDTO.Response.builder()
                .id(staff.getId())
                .staffId(staff.getStaffId())
                .firstName(staff.getFirstName())
                .lastName(staff.getLastName())
                .fullName(staff.getFullName())
                .email(staff.getEmail())
                .phoneNumber(staff.getPhoneNumber())
                .role(staff.getRole())
                .status(staff.getStatus())
                .createdBy(staff.getCreatedBy())
                .createdAt(staff.getCreatedAt())
                .updatedAt(staff.getUpdatedAt())
                .lastLogin(staff.getLastLogin())
                .build();
    }
}
