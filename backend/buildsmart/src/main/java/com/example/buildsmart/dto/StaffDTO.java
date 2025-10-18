package com.example.buildsmart.dto;

import com.example.buildsmart.enums.StaffRole;
import com.example.buildsmart.enums.StaffStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Objects for Staff API
 */
public class StaffDTO {

    /**
     * Request DTO for creating staff
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        @NotBlank(message = "First name is required")
        @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
        @Pattern(regexp = "^[A-Za-z\\s]+$", message = "First name must contain only letters")
        private String firstName;

        @NotBlank(message = "Last name is required")
        @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
        @Pattern(regexp = "^[A-Za-z\\s]+$", message = "Last name must contain only letters")
        private String lastName;

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        private String email;

        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone number must be in international format")
        private String phoneNumber;

        @NotNull(message = "Role is required")
        private StaffRole role;

        private String createdBy;
    }

    /**
     * Request DTO for updating staff
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRequest {
        @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
        @Pattern(regexp = "^[A-Za-z\\s]+$", message = "First name must contain only letters")
        private String firstName;

        @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
        @Pattern(regexp = "^[A-Za-z\\s]+$", message = "Last name must contain only letters")
        private String lastName;

        @Email(message = "Email must be valid")
        private String email;

        @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone number must be in international format")
        private String phoneNumber;

        private StaffRole role;

        private String updatedBy;
    }

    /**
     * Request DTO for changing staff status
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusChangeRequest {
        @NotNull(message = "Status is required")
        private StaffStatus newStatus;

        private String reason;

        private String updatedBy;
    }

    /**
     * Response DTO for staff
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String staffId;
        private String firstName;
        private String lastName;
        private String fullName;
        private String email;
        private String phoneNumber;
        private StaffRole role;
        private StaffStatus status;
        private String createdBy;

        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime createdAt;

        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime updatedAt;

        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime lastLogin;
    }

    /**
     * Summary DTO for staff (minimal info)
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Summary {
        private String staffId;
        private String fullName;
        private String email;
        private StaffRole role;
        private StaffStatus status;
    }

    /**
     * Statistics DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Statistics {
        private long totalStaff;
        private long activeStaff;
        private long inactiveStaff;
        private long suspendedStaff;
        private long pendingActivation;
        private java.util.Map<StaffRole, Long> staffByRole;
        private java.util.Map<StaffStatus, Long> staffByStatus;
    }

    /**
     * Search criteria DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SearchCriteria {
        private String searchTerm;
        private StaffRole role;
        private StaffStatus status;
        private LocalDateTime createdAfter;
        private LocalDateTime createdBefore;
        private Integer page;
        private Integer size;
        private String sortBy;
        private String sortDirection;
    }
}