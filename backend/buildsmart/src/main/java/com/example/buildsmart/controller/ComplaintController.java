package com.example.buildsmart.controller;

import com.example.buildsmart.model.Complaint;
import com.example.buildsmart.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "http://localhost:3000")
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    @PostMapping
    public ResponseEntity<Complaint> createComplaint(@RequestBody Complaint complaint) {
        complaint.setComplaintDate(LocalDate.now());
        complaint.setStatus("open");
        Complaint savedComplaint = complaintRepository.save(complaint);
        return ResponseEntity.ok(savedComplaint);
    }

    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaintById(@PathVariable Long id) {
        Optional<Complaint> complaint = complaintRepository.findById(id);
        return complaint.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public List<Complaint> getComplaintsByStatus(@PathVariable String status) {
        return complaintRepository.findByStatus(status);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Complaint> updateComplaint(@PathVariable Long id, @RequestBody Complaint complaint) {
        return complaintRepository.findById(id)
            .map(existingComplaint -> {
                existingComplaint.setStatus(complaint.getStatus());
                existingComplaint.setResolution(complaint.getResolution());
                existingComplaint.setAssignedTo(complaint.getAssignedTo());
                existingComplaint.setNotes(complaint.getNotes());
                Complaint updated = complaintRepository.save(existingComplaint);
                return ResponseEntity.ok(updated);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComplaint(@PathVariable Long id) {
        if (complaintRepository.existsById(id)) {
            complaintRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

