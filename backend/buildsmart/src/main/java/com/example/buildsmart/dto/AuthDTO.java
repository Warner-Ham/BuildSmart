package com.example.buildsmart.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank(message = "Username is required")
        private String username;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LoginResponse {
        private String token;
        private String username;
        private String fullName;
        private String role;
        private String staffId;
        private String email;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        @NotBlank(message = "Username is required")
        @Size(min = 4, max = 50, message = "Username must be between 4 and 50 characters")
        private String username;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        @NotBlank(message = "First name is required")
        private String firstName;

        @NotBlank(message = "Last name is required")
        private String lastName;

        @NotBlank(message = "Email is required")
        private String email;

        @NotBlank(message = "Phone number is required")
        private String phoneNumber;

        @NotBlank(message = "Role is required")
        private String role;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RegisterResponse {
        private String message;
        private String username;
        private String staffId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RefreshTokenRequest {
        private String token;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TokenResponse {
        private String token;
    }
}
