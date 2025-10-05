package com.example.buildsmart.repository;

import com.example.buildsmart.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffRepository extends JpaRepository<Staff, String> {
    Staff findByUsername(String username);
}
