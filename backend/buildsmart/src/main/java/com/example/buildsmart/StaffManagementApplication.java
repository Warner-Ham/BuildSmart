package com.example.buildsmart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.modelmapper.ModelMapper;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;

/**
 * BuildSmart Staff Management Application
 * Spring Boot main application class
 */
@SpringBootApplication
public class StaffManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(StaffManagementApplication.class, args);

        System.out.println("Application started successfully!");
        System.out.println("API Documentation: http://localhost:8080/swagger-ui.html");
        System.out.println("API Endpoints: http://localhost:8080/api/v1/staff");
        System.out.println("Health Check: http://localhost:8080/actuator/health");
        System.out.println();
    }

    /**
     * ModelMapper bean for DTO mapping
     */
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    /**
     * OpenAPI configuration for Swagger documentation
     */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("BuildSmart Staff Management API")
                        .version("2.0.0")
                        .description("RESTful API for Construction Staff Management System")
                        .contact(new Contact()
                                .name("BuildSmart Team")
                                .email("support@buildsmart.com")
                                .url("https://buildsmart.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }
}