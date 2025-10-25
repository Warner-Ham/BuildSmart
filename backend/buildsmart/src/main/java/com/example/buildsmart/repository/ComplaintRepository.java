package com.example.buildsmart.repository;

import com.example.buildsmart.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByStatus(String status);
    List<Complaint> findByComplaintType(String complaintType);
    List<Complaint> findBySeverity(String severity);
    List<Complaint> findByAssignedTo(String assignedTo);
}

