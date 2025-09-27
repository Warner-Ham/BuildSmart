package com.example.buildsmart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Spring Boot Application Class for Staff Management
 */
@SpringBootApplication
public class StaffManagementApplication {

    public static void main(String[] args){
        SpringApplication.run(StaffManagementApplication.class, args);

        System.out.println("\nConstruction Staff Management System Started!");
        System.out.println("Backend API running on: http://localhost:8080");
        System.out.println("React Frontend should connect to: http://localhost:8080/api");
        System.out.println("API Documentation:");
        System.out.println("   GET    /api/staff        - Get all staff");
        System.out.println("   POST   /api/staff        - Create new staff");
        System.out.println("   GET    /api/staff/{id}   - Get staff by ID");
        System.out.println("   PUT    /api/staff/{id}   - Update staff");
        System.out.println("   DELETE /api/staff/{id}   - Delete staff");
        System.out.println("   GET    /api/staff/search - Search staff");
        System.out.println("   GET    /api/staff/stats  - Get statistics");
        System.out.println("Sample data will be initialized automatically\n");
    }
}
