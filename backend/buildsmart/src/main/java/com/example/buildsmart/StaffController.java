package com.example.buildsmart;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.buildsmart.model.Staff;
import com.example.buildsmart.repository.StaffRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class StaffController {
    @Autowired
    private StaffRepository staffRepository;

    @GetMapping("/api/staff")
    public List<Staff> getStaff() {
        return staffRepository.findAll();
    }

    @GetMapping("/api/staff/{id}")
    public ResponseEntity<Staff> getStaffById(@PathVariable String id) {
        Optional<Staff> staff = staffRepository.findById(id);
        return staff.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/api/staff")
    public ResponseEntity<Staff> createStaff(@RequestBody Staff staff) {
        // Set default values
        if (staff.getIsActive() == null) {
            staff.setIsActive(true);
        }
        Staff savedStaff = staffRepository.save(staff);
        return ResponseEntity.ok(savedStaff);
    }

    @PutMapping("/api/staff/{id}")
    public ResponseEntity<Staff> updateStaff(@PathVariable String id, @RequestBody Staff staff) {
        return staffRepository.findById(id)
            .map(existingStaff -> {
                if (staff.getUsername() != null) existingStaff.setUsername(staff.getUsername());
                if (staff.getPassword() != null && !staff.getPassword().trim().isEmpty()) {
                    existingStaff.setPassword(staff.getPassword());
                }
                if (staff.getEmail() != null) existingStaff.setEmail(staff.getEmail());
                if (staff.getRole() != null) existingStaff.setRole(staff.getRole());
                if (staff.getFirstName() != null) existingStaff.setFirstName(staff.getFirstName());
                if (staff.getLastName() != null) existingStaff.setLastName(staff.getLastName());
                if (staff.getPhone() != null) existingStaff.setPhone(staff.getPhone());
                if (staff.getDepartment() != null) existingStaff.setDepartment(staff.getDepartment());
                if (staff.getIsActive() != null) existingStaff.setIsActive(staff.getIsActive());
                
                Staff updated = staffRepository.save(existingStaff);
                return ResponseEntity.ok(updated);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/api/staff/{id}/status")
    public ResponseEntity<Staff> updateStaffStatus(@PathVariable String id, @RequestBody Staff staff) {
        return staffRepository.findById(id)
            .map(existingStaff -> {
                existingStaff.setIsActive(staff.getIsActive());
                Staff updated = staffRepository.save(existingStaff);
                return ResponseEntity.ok(updated);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/api/staff/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable String id) {
        if (staffRepository.existsById(id)) {
            staffRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
