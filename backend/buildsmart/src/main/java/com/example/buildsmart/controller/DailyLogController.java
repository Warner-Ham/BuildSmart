package com.example.buildsmart.controller;

import com.example.buildsmart.model.DailyLog;
import com.example.buildsmart.model.Project;
import com.example.buildsmart.service.DailyLogService;
import com.example.buildsmart.dto.DailyLogDTO;
import com.example.buildsmart.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/daily-logs")
@CrossOrigin(origins = "http://localhost:3000")
public class DailyLogController {

    @Autowired
    private DailyLogService dailyLogService;

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping
    public ResponseEntity<List<DailyLog>> getAllDailyLogs() {
        try {
            List<DailyLog> dailyLogs = dailyLogService.getAllDailyLogs();
            return ResponseEntity.ok(dailyLogs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<DailyLog> createDailyLog(@RequestBody DailyLogDTO dailyLogDTO) {
        try {
            // Convert DTO to entity
            DailyLog dailyLog = convertDTOToEntity(dailyLogDTO);
            DailyLog createdLog = dailyLogService.createDailyLog(dailyLog);
            return ResponseEntity.ok(createdLog);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/project/{projectId}")
    public List<DailyLog> getDailyLogsByProject(@PathVariable Long projectId) {
        return dailyLogService.getDailyLogsByProject(projectId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DailyLog> updateDailyLog(
            @PathVariable Long id,
            @RequestBody DailyLogDTO dailyLogDTO,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestParam(value = "reason", required = false) String changeReason) {

        try {
            // Convert DTO to entity
            DailyLog dailyLog = convertDTOToEntity(dailyLogDTO);
            DailyLog updatedLog = dailyLogService.updateDailyLog(id, dailyLog, userId, changeReason);
            return ResponseEntity.ok(updatedLog);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDailyLog(@PathVariable Long id) {
        try {
            dailyLogService.deleteDailyLog(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Helper method to convert DTO to entity
    private DailyLog convertDTOToEntity(DailyLogDTO dto) {
        DailyLog dailyLog = new DailyLog();
        
        // Find and set the project
        Optional<Project> project = projectRepository.findById(dto.getProject_id());
        if (project.isPresent()) {
            dailyLog.setProject(project.get());
        } else {
            throw new RuntimeException("Project not found with id: " + dto.getProject_id());
        }
        
        // Set other fields
        dailyLog.setLogDate(dto.getLog_date());
        dailyLog.setMaterialsUsed(dto.getMaterials_used());
        dailyLog.setLaborHours(dto.getLabor_hours());
        dailyLog.setMachineryHours(dto.getMachinery_hours());
        dailyLog.setComments(dto.getComments());
        dailyLog.setCreatedBy(dto.getCreated_by());
        
        return dailyLog;
    }
}
