package com.example.buildsmart.Service;


import com.example.buildsmart.model.Project;
import com.example.buildsmart.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public Project updateProject(Long id, Project projectDetails) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        // Only update fields that exist in your Project entity
        project.setName(projectDetails.getName());
        project.setClient(projectDetails.getClient());
        project.setLocation(projectDetails.getLocation());
        project.setStatus(projectDetails.getStatus());
        project.setImages(projectDetails.getImages());

        return projectRepository.save(project);
    }

    public boolean deleteProject(Long id) {
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
            return true;
        }
        return false;
    }
}