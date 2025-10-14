// package com.example.buildsmart.service;

// import com.example.buildsmart.model.Project;
// import com.example.buildsmart.repository.ProjectRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import java.util.List;
// import java.util.Optional;

// @Service
// public class ProjectServiceImpl implements ProjectService {

//     @Autowired
//     private ProjectRepository projectRepository;

//     @Override
//     public List<Project> getAllProjects() {
//         return projectRepository.findAll();
//     }

//     @Override
//     public Project getProjectById(Long id) {
//         Optional<Project> project = projectRepository.findById(id);
//         return project.orElse(null);
//     }

//     @Override
//     public Project updateProject(Long id, Project project) {
//         if (projectRepository.existsById(id)) {
//             project.setId(id);
//             return projectRepository.save(project);
//         }
//         return null;
//     }
// }
