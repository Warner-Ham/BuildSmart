package com.example.buildsmart.services;

import com.example.buildsmart.dto.AuthDTO;
import com.example.buildsmart.entity.Staff;
import com.example.buildsmart.enums.StaffRole;
import com.example.buildsmart.enums.StaffStatus;
import com.example.buildsmart.repositories.StaffRepository;
import com.example.buildsmart.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final long LOCK_TIME_DURATION = 30; // minutes

    public AuthDTO.LoginResponse login(AuthDTO.LoginRequest request) {
        Staff staff = staffRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        // Check if an account is locked
        if (staff.getAccountLocked()) {
            if (isAccountUnlockable(staff)) {
                unlockAccount(staff);
            } else {
                throw new LockedException("Account is locked. Please contact administrator.");
            }
        }

        // Check if an account is active
        if (!staff.isActive()) {
            throw new BadCredentialsException("Account is not active");
        }

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), staff.getPassword())) {
            handleFailedLogin(staff);
            throw new BadCredentialsException("Invalid username or password");
        }

        // Reset failed attempts on successful login
        staff.setFailedLoginAttempts(0);
        staff.updateLastLogin();
        staffRepository.save(staff);

        // Generate JWT token
        String token = jwtUtil.generateToken(staff.getUsername(), staff.getRole().name());

        log.info("User logged in successfully: {}", staff.getUsername());

        return AuthDTO.LoginResponse.builder()
                .token(token)
                .username(staff.getUsername())
                .fullName(staff.getFullName())
                .role(staff.getRole().name())
                .staffId(staff.getStaffId())
                .email(staff.getEmail())
                .build();
    }

    public AuthDTO.RegisterResponse register(AuthDTO.RegisterRequest request) {
        // Check if a username already exists
        if (staffRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        // Check if email already exists
        if (staffRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Create new staff
        Staff staff = Staff.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .role(StaffRole.valueOf(request.getRole()))
                .status(StaffStatus.ACTIVE)
                .failedLoginAttempts(0)
                .accountLocked(false)
                .build();

        Staff savedStaff = staffRepository.save(staff);

        log.info("New staff registered: {}", savedStaff.getUsername());

        return AuthDTO.RegisterResponse.builder()
                .message("Registration successful")
                .username(savedStaff.getUsername())
                .staffId(savedStaff.getStaffId())
                .build();
    }

    private void handleFailedLogin(Staff staff) {
        int attempts = staff.getFailedLoginAttempts() + 1;
        staff.setFailedLoginAttempts(attempts);

        if (attempts >= MAX_FAILED_ATTEMPTS) {
            staff.setAccountLocked(true);
            staff.setLockTime(LocalDateTime.now());
            log.warn("Account locked due to too many failed attempts: {}", staff.getUsername());
        }

        staffRepository.save(staff);
    }

    private boolean isAccountUnlockable(Staff staff) {
        if (staff.getLockTime() == null) {
            return false;
        }
        LocalDateTime unlockTime = staff.getLockTime().plusMinutes(LOCK_TIME_DURATION);
        return LocalDateTime.now().isAfter(unlockTime);
    }

    private void unlockAccount(Staff staff) {
        staff.setAccountLocked(false);
        staff.setFailedLoginAttempts(0);
        staff.setLockTime(null);
        staffRepository.save(staff);
        log.info("Account unlocked: {}", staff.getUsername());
    }
}
