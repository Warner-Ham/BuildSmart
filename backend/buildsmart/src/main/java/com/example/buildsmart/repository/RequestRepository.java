package com.example.buildsmart.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.buildsmart.model.Request;

public interface RequestRepository extends JpaRepository<Request, Long> {
}
