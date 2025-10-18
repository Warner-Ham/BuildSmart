/*package com.example.buildsmart.controller;

import com.example.buildsmart.model.ConstructionProject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ConstructionController {
    @GetMapping("/api/projects")
    public List<ConstructionProject> getProjects() {
        return Arrays.asList(
            new ConstructionProject("Green Tower - Smart Apartments", "Ongoing", "Colombo"),
            new ConstructionProject("EcoMall - Sustainable Shopping Center", "Completed", "Kandy"),
            new ConstructionProject("Skyline Office Complex", "Planned", "Galle")
        );
    }
}
*/