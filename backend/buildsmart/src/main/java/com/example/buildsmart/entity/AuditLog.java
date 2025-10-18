package com.example.buildsmart.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
/**
 * AuditLog Entity - Tracks all system activities
 * Provides complete traceability for compliance
 */
@Entity
@Table(name = "audit_log", indexes = {
        @Index(name = "idx_staff_id", columnList = "staff_id"),
        @Index(name = "idx_action", columnList = "action"),
        @Index(name = "idx_timestamp", columnList = "timestamp")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "action", nullable = false, length = 50)
    private String action;

    @Column(name = "staff_id", length = 50)
    private String staffId;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "performed_by", nullable = false, length = 50)
    private String performedBy;

    @CreationTimestamp
    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 255)
    private String userAgent;

    /**
     * Create audit log entry
     */
    public static AuditLog create(String action, String staffId, String description, String performedBy) {
        return AuditLog.builder()
                .action(action)
                .staffId(staffId)
                .description(description)
                .performedBy(performedBy)
                .build();
    }
}
