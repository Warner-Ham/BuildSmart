package com.example.buildsmart.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.buildsmart.model.Staff;
import com.example.buildsmart.repository.StaffRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @Autowired
    private StaffRepository staffRepository;
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Find staff by username
            Staff staff = staffRepository.findByUsername(request.getUsername());
            
            if (staff == null) {
                response.put("success", false);
                response.put("message", "Invalid username or password");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Check if staff is active
            if (!staff.getIsActive()) {
                response.put("success", false);
                response.put("message", "Account is deactivated");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Validate password (in production, use proper password hashing)
            if (!staff.getPassword().equals(request.getPassword())) {
                response.put("success", false);
                response.put("message", "Invalid username or password");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Login successful
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("user", Map.of(
                "id", staff.getId(),
                "username", staff.getUsername(),
                "role", staff.getRole(),
                "firstName", staff.getFirstName(),
                "lastName", staff.getLastName(),
                "email", staff.getEmail(),
                "department", staff.getDepartment()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @PostMapping("/login/document-control-manager")
    public ResponseEntity<Map<String, Object>> loginDocumentControlManager(@RequestBody LoginRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Staff staff = staffRepository.findByUsername(request.getUsername());
            
            if (staff == null || !staff.getPassword().equals(request.getPassword()) || !staff.getIsActive()) {
                response.put("success", false);
                response.put("message", "Invalid credentials or account deactivated");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Check if user has Document Control Manager role
            if (!"Document Control Manager".equals(staff.getRole())) {
                response.put("success", false);
                response.put("message", "Access denied. This login is for Document Control Managers only.");
                return ResponseEntity.badRequest().body(response);
            }
            
            response.put("success", true);
            response.put("message", "Document Control Manager login successful");
            response.put("user", Map.of(
                "id", staff.getId(),
                "username", staff.getUsername(),
                "role", staff.getRole(),
                "firstName", staff.getFirstName(),
                "lastName", staff.getLastName(),
                "email", staff.getEmail(),
                "department", staff.getDepartment()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @PostMapping("/login/staff-manager")
    public ResponseEntity<Map<String, Object>> loginStaffManager(@RequestBody LoginRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Staff staff = staffRepository.findByUsername(request.getUsername());
            
            if (staff == null || !staff.getPassword().equals(request.getPassword()) || !staff.getIsActive()) {
                response.put("success", false);
                response.put("message", "Invalid credentials or account deactivated");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Check if user has Admin role (Staff Manager functionality)
            if (!"Admin".equals(staff.getRole())) {
                response.put("success", false);
                response.put("message", "Access denied. This login is for Staff Managers (Admin) only.");
                return ResponseEntity.badRequest().body(response);
            }
            
            response.put("success", true);
            response.put("message", "Staff Manager login successful");
            response.put("user", Map.of(
                "id", staff.getId(),
                "username", staff.getUsername(),
                "role", staff.getRole(),
                "firstName", staff.getFirstName(),
                "lastName", staff.getLastName(),
                "email", staff.getEmail(),
                "department", staff.getDepartment()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    // Inner class for login request
    public static class LoginRequest {
        private String username;
        private String password;
        
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
