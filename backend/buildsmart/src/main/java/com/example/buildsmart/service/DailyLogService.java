package com.example.buildsmart.Service;

import com.example.buildsmart.model.DailyLog;
import com.example.buildsmart.model.AuditTrail;
import com.example.buildsmart.repository.DailyLogRepository;
import com.example.buildsmart.repository.AuditTrailRepository;
import com.example.buildsmart.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Objects;

@Service
@Transactional
public class DailyLogService {

    @Autowired
    private DailyLogRepository dailyLogRepository;

    @Autowired
    private AuditTrailRepository auditTrailRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public DailyLog createDailyLog(DailyLog dailyLog) {
        // Validate project exists
        projectRepository.findById(dailyLog.getProject().getId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Check for duplicate log date
        dailyLogRepository.findByProjectIdAndLogDate(
                        dailyLog.getProject().getId(), dailyLog.getLogDate())
                .ifPresent(existingLog -> {
                    throw new RuntimeException("Log already exists for this date");
                });

        dailyLog.setCreatedAt(java.time.LocalDateTime.now());
        return dailyLogRepository.save(dailyLog);
    }

    public List<DailyLog> getAllDailyLogs() {
        return dailyLogRepository.findAll();
    }

    public List<DailyLog> getDailyLogsByProject(Long projectId) {
        return dailyLogRepository.findByProjectIdOrderByLogDateDesc(projectId);
    }

    public DailyLog updateDailyLog(Long id, DailyLog dailyLogDetails, String changedBy, String changeReason) {
        DailyLog dailyLog = dailyLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Daily log not found"));

        trackChanges(dailyLog, dailyLogDetails, changedBy, changeReason);

        // Update all fields that can be modified
        if (dailyLogDetails.getLogDate() != null) {
            dailyLog.setLogDate(dailyLogDetails.getLogDate());
        }
        if (dailyLogDetails.getMaterialsUsed() != null) {
            dailyLog.setMaterialsUsed(dailyLogDetails.getMaterialsUsed());
        }
        if (dailyLogDetails.getLaborHours() != null) {
            dailyLog.setLaborHours(dailyLogDetails.getLaborHours());
        }
        if (dailyLogDetails.getMachineryHours() != null) {
            dailyLog.setMachineryHours(dailyLogDetails.getMachineryHours());
        }
        if (dailyLogDetails.getComments() != null) {
            dailyLog.setComments(dailyLogDetails.getComments());
        }

        return dailyLogRepository.save(dailyLog);
    }

    private void trackChanges(DailyLog oldLog, DailyLog newLog, String changedBy, String changeReason) {
        if (!Objects.equals(oldLog.getLogDate(), newLog.getLogDate())) {
            createAuditEntry(oldLog, "logDate", String.valueOf(oldLog.getLogDate()),
                    String.valueOf(newLog.getLogDate()), changedBy, changeReason);
        }
        if (!Objects.equals(oldLog.getMaterialsUsed(), newLog.getMaterialsUsed())) {
            createAuditEntry(oldLog, "materialsUsed", oldLog.getMaterialsUsed(),
                    newLog.getMaterialsUsed(), changedBy, changeReason);
        }
        if (!Objects.equals(oldLog.getLaborHours(), newLog.getLaborHours())) {
            createAuditEntry(oldLog, "laborHours", String.valueOf(oldLog.getLaborHours()),
                    String.valueOf(newLog.getLaborHours()), changedBy, changeReason);
        }
        if (!Objects.equals(oldLog.getMachineryHours(), newLog.getMachineryHours())) {
            createAuditEntry(oldLog, "machineryHours", String.valueOf(oldLog.getMachineryHours()),
                    String.valueOf(newLog.getMachineryHours()), changedBy, changeReason);
        }
        if (!Objects.equals(oldLog.getComments(), newLog.getComments())) {
            createAuditEntry(oldLog, "comments", oldLog.getComments(),
                    newLog.getComments(), changedBy, changeReason);
        }
    }

    private void createAuditEntry(DailyLog log, String field, String oldValue,
                                  String newValue, String changedBy, String changeReason) {
        AuditTrail audit = new AuditTrail(log, field, oldValue, newValue, changedBy, changeReason);
        auditTrailRepository.save(audit);
    }

    public void deleteDailyLog(Long id) {
        dailyLogRepository.deleteById(id);
    }
}
