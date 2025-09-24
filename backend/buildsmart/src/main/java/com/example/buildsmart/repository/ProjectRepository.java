package com.example.buildsmart.repository;

import com.example.buildsmart.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}
