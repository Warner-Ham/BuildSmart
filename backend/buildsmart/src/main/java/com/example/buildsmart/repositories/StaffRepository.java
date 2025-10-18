package com.example.buildsmart.repositories;

import com.example.buildsmart.entity.Staff;
import com.example.buildsmart.enums.StaffRole;
import com.example.buildsmart.enums.StaffStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Staff Repository - Spring Data JPA Repository
 * Provides database operations for Staff entity
 */
@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {

    // ==================== FIND BY UNIQUE FIELDS ====================

    /**
     * Find staff by staff ID
     */
    Optional<Staff> findByStaffId(String staffId);

    /**
     * Find staff by email
     */
    Optional<Staff> findByEmail(String email);

    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);

    /**
     * Find staff by username (for authentication)
     */
    Optional<Staff> findByUsername(String username);

    /**
     * Check if username exists
     */
    boolean existsByUsername(String username);

    /**
     * Check if staff ID exists
     */
    boolean existsByStaffId(String staffId);

    // ==================== FIND BY ROLE ====================

    /**
     * Find all staff by role
     */
    List<Staff> findByRole(StaffRole role);

    /**
     * Find staff by role with pagination
     */
    Page<Staff> findByRole(StaffRole role, Pageable pageable);

    /**
     * Count staff by role
     */
    long countByRole(StaffRole role);

    // ==================== FIND BY STATUS ====================

    /**
     * Find all staff by status
     */
    List<Staff> findByStatus(StaffStatus status);

    /**
     * Find staff by status with pagination
     */
    Page<Staff> findByStatus(StaffStatus status, Pageable pageable);

    /**
     * Count staff by status
     */
    long countByStatus(StaffStatus status);

    // ==================== FIND BY ROLE AND STATUS ====================

    /**
     * Find staff by role and status
     */
    List<Staff> findByRoleAndStatus(StaffRole role, StaffStatus status);

    /**
     * Find active staff by role
     */
    @Query("SELECT s FROM Staff s WHERE s.role = :role AND s.status = 'ACTIVE'")
    List<Staff> findActiveStaffByRole(@Param("role") StaffRole role);

    // ==================== SEARCH BY NAME ====================

    /**
     * Find staff by first name (case insensitive)
     */
    List<Staff> findByFirstNameContainingIgnoreCase(String firstName);

    /**
     * Find staff by last name (case insensitive)
     */
    List<Staff> findByLastNameContainingIgnoreCase(String lastName);

    /**
     * Find staff by full name search
     */
    @Query("SELECT s FROM Staff s WHERE " +
            "LOWER(s.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(s.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(CONCAT(s.firstName, ' ', s.lastName)) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Staff> searchByName(@Param("searchTerm") String searchTerm);

    /**
     * Find staff by first name and last name
     */
    @Query("SELECT s FROM Staff s WHERE " +
            "(:firstName IS NULL OR LOWER(s.firstName) LIKE LOWER(CONCAT('%', :firstName, '%'))) AND " +
            "(:lastName IS NULL OR LOWER(s.lastName) LIKE LOWER(CONCAT('%', :lastName, '%')))")
    List<Staff> findByFirstNameAndLastName(
            @Param("firstName") String firstName,
            @Param("lastName") String lastName
    );

    // ==================== DATE-BASED QUERIES ====================

    /**
     * Find staff created after specific date
     */
    List<Staff> findByCreatedAtAfter(LocalDateTime date);

    /**
     * Find staff created between dates
     */
    List<Staff> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find staff who logged in recently
     */
    List<Staff> findByLastLoginAfter(LocalDateTime date);

    /**
     * Find staff who never logged in
     */
    List<Staff> findByLastLoginIsNull();

    // ==================== CREATED BY QUERIES ====================

    /**
     * Find staff created by specific admin
     */
    List<Staff> findByCreatedBy(String createdBy);

    /**
     * Count staff created by specific admin
     */
    long countByCreatedBy(String createdBy);

    // ==================== STATISTICS QUERIES ====================

    /**
     * Get total active staff count
     */
    @Query("SELECT COUNT(s) FROM Staff s WHERE s.status = 'ACTIVE'")
    long countActiveStaff();

    /**
     * Get staff statistics by role
     */
    @Query("SELECT s.role, COUNT(s) FROM Staff s GROUP BY s.role")
    List<Object[]> getStaffCountByRole();

    /**
     * Get staff statistics by status
     */
    @Query("SELECT s.status, COUNT(s) FROM Staff s GROUP BY s.status")
    List<Object[]> getStaffCountByStatus();

    // ==================== CUSTOM QUERIES ====================

    /**
     * Find staff with specific criteria
     */
    @Query("SELECT s FROM Staff s WHERE " +
            "(:role IS NULL OR s.role = :role) AND " +
            "(:status IS NULL OR s.status = :status) AND " +
            "(:searchTerm IS NULL OR LOWER(s.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(s.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(s.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Staff> findWithCriteria(
            @Param("role") StaffRole role,
            @Param("status") StaffStatus status,
            @Param("searchTerm") String searchTerm,
            Pageable pageable
    );

    /**
     * Find staff needing reactivation (inactive for > 30 days)
     */
    @Query("SELECT s FROM Staff s WHERE s.status = 'INACTIVE' AND s.updatedAt < :date")
    List<Staff> findStaffNeedingReactivation(@Param("date") LocalDateTime date);

    /**
     * Get recently created staff (last 7 days)
     */
    @Query("SELECT s FROM Staff s WHERE s.createdAt >= :weekAgo ORDER BY s.createdAt DESC")
    List<Staff> getRecentlyCreatedStaff(@Param("weekAgo") LocalDateTime weekAgo);
}