package com.example.buildsmart.service;

import com.example.buildsmart.model.MonthlyReport;
import com.example.buildsmart.model.Project;
import com.example.buildsmart.repository.MonthlyReportRepository;
import com.example.buildsmart.repository.ProjectRepository;
import com.example.buildsmart.repository.DailyLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

/**
 * Scheduled service for automatic monthly report generation
 * This service runs at the end of each month to generate monthly reports
 * from daily logs for all active projects
 */
@Service
@Transactional
public class MonthlyReportScheduler {

    @Autowired
    private MonthlyReportRepository monthlyReportRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private DailyLogRepository dailyLogRepository;

    @Autowired
    private MonthlyReportService monthlyReportService;

    /**
     * Scheduled method that runs on the last day of each month at 11:59 PM
     * Generates monthly reports for all active projects that have daily logs
     */
    @Scheduled(cron = "0 59 23 L * ?") // Last day of month at 11:59 PM
    public void generateMonthlyReportsForAllProjects() {
        try {
            System.out.println("Starting automatic monthly report generation...");

            // Get the previous month (since we're running on the last day)
            LocalDate today = LocalDate.now();
            YearMonth previousMonth = YearMonth.from(today.minusMonths(1));

            int year = previousMonth.getYear();
            int month = previousMonth.getMonthValue();

            System.out.println("Generating reports for: " + year + "/" + month);

            // Get all active projects
            List<Project> activeProjects = projectRepository.findByStatus("In Progress");

            int reportsGenerated = 0;
            int reportsSkipped = 0;

            for (Project project : activeProjects) {
                try {
                    // Check if report already exists for this project and month
                    Optional<MonthlyReport> existingReport = monthlyReportRepository
                            .findByProjectIdAndReportYearAndReportMonth(project.getId(), year, month);

                    if (existingReport.isPresent()) {
                        System.out.println("Report already exists for project: " + project.getName());
                        reportsSkipped++;
                        continue;
                    }

                    // Check if there are daily logs for this project in the specified month
                    LocalDate startDate = LocalDate.of(year, month, 1);
                    LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

                    List<com.example.buildsmart.model.DailyLog> dailyLogs = dailyLogRepository
                            .findByProjectIdAndLogDateBetween(project.getId(), startDate, endDate);

                    if (dailyLogs.isEmpty()) {
                        System.out.println("No daily logs found for project: " + project.getName());
                        reportsSkipped++;
                        continue;
                    }

                    // Generate the monthly report
                    monthlyReportService.generateMonthlyReportFromDailyLogs(
                            project.getId(), year, month, "System Auto-Generator"
                    );

                    System.out.println("Generated monthly report for project: " + project.getName());
                    reportsGenerated++;

                } catch (Exception e) {
                    System.err.println("Error generating report for project " + project.getName() + ": " + e.getMessage());
                    e.printStackTrace();
                }
            }

            System.out.println("Monthly report generation completed. Generated: " + reportsGenerated + ", Skipped: " + reportsSkipped);

        } catch (Exception e) {
            System.err.println("Error in monthly report generation scheduler: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Manual trigger method for generating monthly reports
     * Can be called via API endpoint for testing or manual generation
     */
    public void generateMonthlyReportsForMonth(int year, int month) {
        try {
            System.out.println("Manual monthly report generation for: " + year + "/" + month);

            // Get all active projects
            List<Project> activeProjects = projectRepository.findByStatus("In Progress");

            int reportsGenerated = 0;
            int reportsSkipped = 0;

            for (Project project : activeProjects) {
                try {
                    // Check if report already exists for this project and month
                    Optional<MonthlyReport> existingReport = monthlyReportRepository
                            .findByProjectIdAndReportYearAndReportMonth(project.getId(), year, month);

                    if (existingReport.isPresent()) {
                        System.out.println("Report already exists for project: " + project.getName());
                        reportsSkipped++;
                        continue;
                    }

                    // Check if there are daily logs for this project in the specified month
                    LocalDate startDate = LocalDate.of(year, month, 1);
                    LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

                    List<com.example.buildsmart.model.DailyLog> dailyLogs = dailyLogRepository
                            .findByProjectIdAndLogDateBetween(project.getId(), startDate, endDate);

                    if (dailyLogs.isEmpty()) {
                        System.out.println("No daily logs found for project: " + project.getName());
                        reportsSkipped++;
                        continue;
                    }

                    // Generate the monthly report
                    monthlyReportService.generateMonthlyReportFromDailyLogs(
                            project.getId(), year, month, "Manual Generator"
                    );

                    System.out.println("Generated monthly report for project: " + project.getName());
                    reportsGenerated++;

                } catch (Exception e) {
                    System.err.println("Error generating report for project " + project.getName() + ": " + e.getMessage());
                    e.printStackTrace();
                }
            }

            System.out.println("Manual monthly report generation completed. Generated: " + reportsGenerated + ", Skipped: " + reportsSkipped);

        } catch (Exception e) {
            System.err.println("Error in manual monthly report generation: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Generate monthly report for a specific project and month
     * Used by the frontend when Document Control Manager manually generates reports
     */
    public void generateMonthlyReportForProject(Long projectId, int year, int month, String createdBy) {
        try {
            System.out.println("Generating monthly report for project ID: " + projectId + " for " + year + "/" + month);

            // Check if report already exists
            Optional<MonthlyReport> existingReport = monthlyReportRepository
                    .findByProjectIdAndReportYearAndReportMonth(projectId, year, month);

            if (existingReport.isPresent()) {
                throw new RuntimeException("Monthly report already exists for this project and period");
            }

            // Check if there are daily logs for this project in the specified month
            LocalDate startDate = LocalDate.of(year, month, 1);
            LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

            List<com.example.buildsmart.model.DailyLog> dailyLogs = dailyLogRepository
                    .findByProjectIdAndLogDateBetween(projectId, startDate, endDate);

            if (dailyLogs.isEmpty()) {
                throw new RuntimeException("No daily logs found for the specified period");
            }

            // Generate the monthly report
            monthlyReportService.generateMonthlyReportFromDailyLogs(projectId, year, month, createdBy);

            System.out.println("Successfully generated monthly report for project ID: " + projectId);

        } catch (Exception e) {
            System.err.println("Error generating monthly report for project ID " + projectId + ": " + e.getMessage());
            throw e;
        }
    }
}

