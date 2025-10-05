package com.example.buildsmart;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
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
}
