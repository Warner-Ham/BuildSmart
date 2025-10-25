package com.example.buildsmart.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.buildsmart.model.ProjectRequest;

public interface ProjectRequestRepository extends JpaRepository<ProjectRequest, Long> {
}
