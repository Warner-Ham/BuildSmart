package com.example.buildsmart.Controller;

import com.example.buildsmart.model.DailyLog;
import com.example.buildsmart.Service.DailyLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/daily-logs")
@CrossOrigin(origins = "http://localhost:3000")
public class DailyLogController {

    @Autowired
    private DailyLogService dailyLogService;

    @PostMapping
    public ResponseEntity<DailyLog> createDailyLog(@RequestBody DailyLog dailyLog) {
        try {
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
            @RequestBody DailyLog dailyLog,
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(value = "reason", required = false) String changeReason) {

        try {
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
}
