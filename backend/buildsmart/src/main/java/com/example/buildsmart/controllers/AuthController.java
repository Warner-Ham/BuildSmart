package com.example.buildsmart.controllers;


import com.example.buildsmart.dto.AuthDTO;
import com.example.buildsmart.services.AuthService;
import com.example.buildsmart.utils.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication Controller
 * Handles login, register, and token operations
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "Authentication and authorization endpoints")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)

public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT token")
    public ResponseEntity<ApiResponse<AuthDTO.LoginResponse>> login(
            @Valid @RequestBody AuthDTO.LoginRequest request) {
        log.info("Login attempt for username: {}", request.getUsername());

        AuthDTO.LoginResponse response = authService.login(request);

        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/register")
    @Operation(summary = "Register new staff", description = "Register a new staff member with credentials")
    public ResponseEntity<ApiResponse<AuthDTO.RegisterResponse>> register(
            @Valid @RequestBody AuthDTO.RegisterRequest request) {
        log.info("Registration attempt for username: {}", request.getUsername());

        AuthDTO.RegisterResponse response = authService.register(request);

        return ResponseEntity.ok(ApiResponse.success("Registration successful", response));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh token", description = "Refresh JWT token")
    public ResponseEntity<ApiResponse<AuthDTO.TokenResponse>> refreshToken(
            @RequestBody AuthDTO.RefreshTokenRequest request) {
        log.info("Token refresh attempt");

        if (!jwtUtil.validateToken(request.getToken())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid or expired token"));
        }

        String username = jwtUtil.extractUsername(request.getToken());
        String role = jwtUtil.extractRole(request.getToken());
        String newToken = jwtUtil.generateToken(username, role);

        AuthDTO.TokenResponse response = AuthDTO.TokenResponse.builder()
                .token(newToken)
                .build();

        return ResponseEntity.ok(ApiResponse.success("Token refreshed", response));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Logout user (client should delete token)")
    public ResponseEntity<ApiResponse<Void>> logout() {
        log.info("Logout request");
        // In a stateless JWT setup, logout is handled client-side by deleting the token
        // Optionally, you can implement token blacklisting here
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
    }

    @GetMapping("/validate")
    @Operation(summary = "Validate token", description = "Check if token is valid")
    public ResponseEntity<ApiResponse<Boolean>> validateToken(
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.ok(ApiResponse.success("Token validation", false));
        }

        String token = authHeader.substring(7);
        boolean isValid = jwtUtil.validateToken(token);

        return ResponseEntity.ok(ApiResponse.success("Token validation", isValid));
    }

    /**
     * API Response wrapper
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
    }
}