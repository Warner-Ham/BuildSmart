package com.example.buildsmart.utils;

import lombok.Getter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Audit Logger for tracking all system activities
 */
public class AuditLogger {
        private final List<AuditEntry> auditLog;
        private final DateTimeFormatter formatter;

        public AuditLogger() {
            this.auditLog = new ArrayList<>();
            this.formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        }

        /**
         * Log an action
         */
        public void logAction(String action, String staffId, String description, String performedBy) {
            AuditEntry entry = new AuditEntry(action, staffId, description, performedBy);
            auditLog.add(entry);
        }

        /**
         * Get an audit trail for specific staff
         */
        public List<String> getAuditTrail(String staffId) {
            return auditLog.stream()
                    .filter(entry -> entry.getStaffId().equals(staffId))
                    .map(AuditEntry::toString)
                    .collect(Collectors.toList());
        }

        /**
         * Get all audit entries
         */
        public List<String> getAllAuditEntries() {
            return auditLog.stream()
                    .map(AuditEntry::toString)
                    .collect(Collectors.toList());
        }

        /**
         * Get recent audit entries
         */
        public List<String> getRecentEntries(int count) {
            int start = Math.max(0, auditLog.size() - count);
            return auditLog.subList(start, auditLog.size()).stream()
                    .map(AuditEntry::toString)
                    .collect(Collectors.toList());
        }

        /**
         * Get audit entries by action type
         */
        public List<String> getEntriesByAction(String action) {
            return auditLog.stream()
                    .filter(entry -> entry.getAction().equalsIgnoreCase(action))
                    .map(AuditEntry::toString)
                    .collect(Collectors.toList());
        }

        /**
         * Inner class representing a single audit entry
         */
        @Getter
        private class AuditEntry {
            private final String action;
            private final String staffId;
            private final String description;
            private final String performedBy;
            private final LocalDateTime timestamp;

            public AuditEntry(String action, String staffId, String description, String performedBy) {
                this.action = action;
                this.staffId = staffId;
                this.description = description;
                this.performedBy = performedBy;
                this.timestamp = LocalDateTime.now();
            }

            @Override
            public String toString() {
                return String.format("[%s] %s | Staff: %s | %s | By: %s",
                        timestamp.format(formatter), action, staffId, description, performedBy);
            }
        }
    }
