package com.example.buildsmart.repositories;

import com.example.buildsmart.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * AuditLog Repository - Spring Data JPA Repository
 * Provides database operations for audit trail
 */
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    /**
     * Find audit logs by staff ID
     */
    List<AuditLog> findByStaffIdOrderByTimestampDesc(String staffId);

    /**
     * Find audit logs by staff ID with pagination
     */
    Page<AuditLog> findByStaffIdOrderByTimestampDesc(String staffId, Pageable pageable);

    /**
     * Find audit logs by action
     */
    List<AuditLog> findByActionOrderByTimestampDesc(String action);

    /**
     * Find audit logs by performer
     */
    List<AuditLog> findByPerformedByOrderByTimestampDesc(String performedBy);

    /**
     * Find recent audit logs
     */
    @Query("SELECT a FROM AuditLog a ORDER BY a.timestamp DESC")
    List<AuditLog> findRecentLogs(Pageable pageable);

    /**
     * Find audit logs between dates
     */
    List<AuditLog> findByTimestampBetweenOrderByTimestampDesc(
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    /**
     * Find audit logs by staff and date range
     */
    @Query("SELECT a FROM AuditLog a WHERE a.staffId = :staffId " +
            "AND a.timestamp BETWEEN :startDate AND :endDate " +
            "ORDER BY a.timestamp DESC")
    List<AuditLog> findByStaffAndDateRange(
            @Param("staffId") String staffId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    /**
     * Count actions by staff
     */
    long countByStaffId(String staffId);

    /**
     * Delete old audit logs (for cleanup)
     */
    void deleteByTimestampBefore(LocalDateTime date);
}
