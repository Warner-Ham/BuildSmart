package com.example.buildsmart.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.buildsmart.model.ProjectRequest;

public interface ProjectRequestRepository extends JpaRepository<ProjectRequest, Long> {

    // Find all requests excluding deleted ones by default
    List<ProjectRequest> findByDeletedFalse();

    // Find all requests including deleted ones
    List<ProjectRequest> findAll();

    // Find requests by status and not deleted
    List<ProjectRequest> findByStatusAndDeletedFalse(String status);

    // Find approved requests that haven't been converted to projects yet
    @Query("SELECT r FROM ProjectRequest r WHERE r.status = 'Accepted' AND r.deleted = false AND r.projectCreated = false")
    List<ProjectRequest> findApprovedAvailableRequests();
}
