package com.example.buildsmart.repository;

import com.example.buildsmart.model.DailyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyLogRepository extends JpaRepository<DailyLog, Long> {
    List<DailyLog> findByProjectIdAndLogDateBetween(Long projectId, LocalDate startDate, LocalDate endDate);
    List<DailyLog> findByProjectId(Long projectId);
    Optional<DailyLog> findByProjectIdAndLogDate(Long projectId, LocalDate logDate);

    List<DailyLog> findByProjectIdOrderByLogDateDesc(Long projectId);
}
