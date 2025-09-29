package com.example.buildsmart.Service;

import com.example.buildsmart.dto.MonthlyReportDTO;
import com.example.buildsmart.dto.MonthlyReportSummaryDTO;
import com.example.buildsmart.model.MonthlyReport;
import com.example.buildsmart.model.Project;
import com.example.buildsmart.model.DailyLog;
import com.example.buildsmart.repository.MonthlyReportRepository;
import com.example.buildsmart.repository.ProjectRepository;
import com.example.buildsmart.repository.DailyLogRepository;
import com.example.buildsmart.exception.MonthlyReportException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class MonthlyReportService {

    @Autowired
    private MonthlyReportRepository monthlyReportRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private DailyLogRepository dailyLogRepository;

    // Create a new monthly report
    public MonthlyReportDTO createMonthlyReport(MonthlyReportDTO reportDTO, String createdBy) {
        // Validate project exists
        Project project = projectRepository.findById(reportDTO.getProjectId())
                .orElseThrow(() -> new MonthlyReportException("Project not found with ID: " + reportDTO.getProjectId()));

        // Check if report already exists for the same project, year, and month
        Optional<MonthlyReport> existingReport = monthlyReportRepository
                .findByProjectIdAndReportYearAndReportMonth(
                        reportDTO.getProjectId(), 
                        reportDTO.getReportYear(), 
                        reportDTO.getReportMonth()
                );

        if (existingReport.isPresent()) {
            throw new MonthlyReportException("Monthly report already exists for project " + 
                    project.getName() + " for " + reportDTO.getReportYear() + "/" + reportDTO.getReportMonth());
        }

        // Create new monthly report
        MonthlyReport monthlyReport = new MonthlyReport(project, reportDTO.getReportYear(), 
                reportDTO.getReportMonth(), createdBy);

        // Set basic information
        monthlyReport.setTotalMaterialsCost(reportDTO.getTotalMaterialsCost());
        monthlyReport.setTotalLaborCost(reportDTO.getTotalLaborCost());
        monthlyReport.setTotalMachineryCost(reportDTO.getTotalMachineryCost());
        monthlyReport.setTotalLaborHours(reportDTO.getTotalLaborHours());
        monthlyReport.setTotalMachineryHours(reportDTO.getTotalMachineryHours());
        monthlyReport.setWorkDays(reportDTO.getWorkDays());
        monthlyReport.setProductivityScore(reportDTO.getProductivityScore());
        monthlyReport.setNotes(reportDTO.getNotes());

        // Calculate totals
        monthlyReport.calculateTotals();

        // Save the report
        MonthlyReport savedReport = monthlyReportRepository.save(monthlyReport);

        return convertToDTO(savedReport);
    }

    // Generate monthly report from daily logs
    public MonthlyReportDTO generateMonthlyReportFromDailyLogs(Long projectId, Integer year, Integer month, String createdBy) {
        // Validate project exists
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new MonthlyReportException("Project not found with ID: " + projectId));

        // Check if report already exists
        Optional<MonthlyReport> existingReport = monthlyReportRepository
                .findByProjectIdAndReportYearAndReportMonth(projectId, year, month);

        if (existingReport.isPresent()) {
            throw new MonthlyReportException("Monthly report already exists for this project and period");
        }

        // Get daily logs for the specified month
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<DailyLog> dailyLogs = dailyLogRepository.findByProjectIdAndLogDateBetween(projectId, startDate, endDate);

        if (dailyLogs.isEmpty()) {
            throw new MonthlyReportException("No daily logs found for the specified period");
        }

        // Calculate totals from daily logs
        BigDecimal totalMaterialsCost = BigDecimal.ZERO;
        BigDecimal totalLaborCost = BigDecimal.ZERO;
        BigDecimal totalMachineryCost = BigDecimal.ZERO;
        Double totalLaborHours = 0.0;
        Double totalMachineryHours = 0.0;
        int workDays = dailyLogs.size();

        // Note: In a real implementation, you would need to calculate costs based on rates
        // For now, we'll use placeholder calculations
        for (DailyLog log : dailyLogs) {
            if (log.getLaborHours() != null) {
                totalLaborHours += log.getLaborHours();
                // Assuming labor rate of $25/hour
                totalLaborCost = totalLaborCost.add(BigDecimal.valueOf(log.getLaborHours() * 25.0));
            }
            if (log.getMachineryHours() != null) {
                totalMachineryHours += log.getMachineryHours();
                // Assuming machinery rate of $50/hour
                totalMachineryCost = totalMachineryCost.add(BigDecimal.valueOf(log.getMachineryHours() * 50.0));
            }
        }

        // Create monthly report
        MonthlyReport monthlyReport = new MonthlyReport(project, year, month, createdBy);
        monthlyReport.setTotalMaterialsCost(totalMaterialsCost);
        monthlyReport.setTotalLaborCost(totalLaborCost);
        monthlyReport.setTotalMachineryCost(totalMachineryCost);
        monthlyReport.setTotalLaborHours(totalLaborHours);
        monthlyReport.setTotalMachineryHours(totalMachineryHours);
        monthlyReport.setWorkDays(workDays);
        
        // Calculate productivity score (simplified)
        if (workDays > 0) {
            double avgDailyHours = (totalLaborHours + totalMachineryHours) / workDays;
            monthlyReport.setProductivityScore(Math.min(100.0, avgDailyHours * 10)); // Simplified calculation
        }

        monthlyReport.calculateTotals();

        MonthlyReport savedReport = monthlyReportRepository.save(monthlyReport);
        return convertToDTO(savedReport);
    }

    // Get monthly report by ID
    public MonthlyReportDTO getMonthlyReportById(Long id) {
        MonthlyReport report = monthlyReportRepository.findById(id)
                .orElseThrow(() -> new MonthlyReportException("Monthly report not found with ID: " + id));
        return convertToDTO(report);
    }

    // Get all monthly reports for a project
    public List<MonthlyReportSummaryDTO> getMonthlyReportsByProject(Long projectId) {
        List<MonthlyReport> reports = monthlyReportRepository.findByProjectIdOrderByReportYearDescReportMonthDesc(projectId);
        return reports.stream()
                .map(this::convertToSummaryDTO)
                .collect(Collectors.toList());
    }

    // Get monthly reports by status
    public List<MonthlyReportSummaryDTO> getMonthlyReportsByStatus(String status) {
        List<MonthlyReport> reports = monthlyReportRepository.findByStatusOrderByCreatedAtDesc(status);
        return reports.stream()
                .map(this::convertToSummaryDTO)
                .collect(Collectors.toList());
    }

    // Get pending approval reports
    public List<MonthlyReportSummaryDTO> getPendingApprovalReports() {
        List<MonthlyReport> reports = monthlyReportRepository.findPendingApprovalReports();
        return reports.stream()
                .map(this::convertToSummaryDTO)
                .collect(Collectors.toList());
    }

    // Update monthly report
    public MonthlyReportDTO updateMonthlyReport(Long id, MonthlyReportDTO reportDTO, String updatedBy) {
        MonthlyReport report = monthlyReportRepository.findById(id)
                .orElseThrow(() -> new MonthlyReportException("Monthly report not found with ID: " + id));

        // Check if report can be updated (not approved)
        if ("APPROVED".equals(report.getStatus())) {
            throw new MonthlyReportException("Cannot update approved report");
        }

        // Update fields
        report.setTotalMaterialsCost(reportDTO.getTotalMaterialsCost());
        report.setTotalLaborCost(reportDTO.getTotalLaborCost());
        report.setTotalMachineryCost(reportDTO.getTotalMachineryCost());
        report.setTotalLaborHours(reportDTO.getTotalLaborHours());
        report.setTotalMachineryHours(reportDTO.getTotalMachineryHours());
        report.setWorkDays(reportDTO.getWorkDays());
        report.setProductivityScore(reportDTO.getProductivityScore());
        report.setNotes(reportDTO.getNotes());

        // Recalculate totals
        report.calculateTotals();
        report.updateTimestamp(updatedBy);

        MonthlyReport savedReport = monthlyReportRepository.save(report);
        return convertToDTO(savedReport);
    }

    // Submit report for approval
    public MonthlyReportDTO submitReport(Long id, String submittedBy) {
        MonthlyReport report = monthlyReportRepository.findById(id)
                .orElseThrow(() -> new MonthlyReportException("Monthly report not found with ID: " + id));

        if (!"DRAFT".equals(report.getStatus())) {
            throw new MonthlyReportException("Only draft reports can be submitted");
        }

        report.submit(submittedBy);
        MonthlyReport savedReport = monthlyReportRepository.save(report);
        return convertToDTO(savedReport);
    }

    // Approve report
    public MonthlyReportDTO approveReport(Long id, String approvedBy) {
        MonthlyReport report = monthlyReportRepository.findById(id)
                .orElseThrow(() -> new MonthlyReportException("Monthly report not found with ID: " + id));

        if (!"SUBMITTED".equals(report.getStatus())) {
            throw new MonthlyReportException("Only submitted reports can be approved");
        }

        report.approve(approvedBy);
        MonthlyReport savedReport = monthlyReportRepository.save(report);
        return convertToDTO(savedReport);
    }

    // Reject report
    public MonthlyReportDTO rejectReport(Long id, String rejectedBy) {
        MonthlyReport report = monthlyReportRepository.findById(id)
                .orElseThrow(() -> new MonthlyReportException("Monthly report not found with ID: " + id));

        if (!"SUBMITTED".equals(report.getStatus())) {
            throw new MonthlyReportException("Only submitted reports can be rejected");
        }

        report.reject(rejectedBy);
        MonthlyReport savedReport = monthlyReportRepository.save(report);
        return convertToDTO(savedReport);
    }

    // Delete monthly report
    public void deleteMonthlyReport(Long id) {
        MonthlyReport report = monthlyReportRepository.findById(id)
                .orElseThrow(() -> new MonthlyReportException("Monthly report not found with ID: " + id));

        if ("APPROVED".equals(report.getStatus())) {
            throw new MonthlyReportException("Cannot delete approved report");
        }

        monthlyReportRepository.deleteById(id);
    }

    // Get reports with high budget variance
    public List<MonthlyReportSummaryDTO> getReportsWithHighVariance(BigDecimal threshold) {
        List<MonthlyReport> reports = monthlyReportRepository.findReportsWithHighVariance(threshold);
        return reports.stream()
                .map(this::convertToSummaryDTO)
                .collect(Collectors.toList());
    }

    // Convert entity to DTO
    private MonthlyReportDTO convertToDTO(MonthlyReport report) {
        MonthlyReportDTO dto = new MonthlyReportDTO();
        dto.setId(report.getId());
        dto.setProjectId(report.getProject().getId());
        dto.setReportYear(report.getReportYear());
        dto.setReportMonth(report.getReportMonth());
        dto.setTotalMaterialsCost(report.getTotalMaterialsCost());
        dto.setTotalLaborCost(report.getTotalLaborCost());
        dto.setTotalMachineryCost(report.getTotalMachineryCost());
        dto.setTotalCost(report.getTotalCost());
        dto.setTotalLaborHours(report.getTotalLaborHours());
        dto.setTotalMachineryHours(report.getTotalMachineryHours());
        dto.setWorkDays(report.getWorkDays());
        dto.setProductivityScore(report.getProductivityScore());
        dto.setBudgetVariance(report.getBudgetVariance());
        dto.setStatus(report.getStatus());
        dto.setNotes(report.getNotes());
        dto.setCreatedBy(report.getCreatedBy());
        dto.setCreatedAt(report.getCreatedAt());
        dto.setUpdatedBy(report.getUpdatedBy());
        dto.setUpdatedAt(report.getUpdatedAt());
        dto.setApprovedBy(report.getApprovedBy());
        dto.setApprovedAt(report.getApprovedAt());
        
        // Set project details
        dto.setProjectName(report.getProject().getName());
        dto.setProjectLocation(report.getProject().getLocation());
        dto.setProjectStatus(report.getProject().getStatus());
        
        return dto;
    }

    // Convert entity to summary DTO
    private MonthlyReportSummaryDTO convertToSummaryDTO(MonthlyReport report) {
        MonthlyReportSummaryDTO dto = new MonthlyReportSummaryDTO();
        dto.setReportId(report.getId());
        dto.setProjectId(report.getProject().getId());
        dto.setProjectName(report.getProject().getName());
        dto.setProjectLocation(report.getProject().getLocation());
        dto.setReportYear(report.getReportYear());
        dto.setReportMonth(report.getReportMonth());
        dto.setTotalCost(report.getTotalCost());
        dto.setBudgetVariance(report.getBudgetVariance());
        dto.setStatus(report.getStatus());
        dto.setProductivityScore(report.getProductivityScore());
        dto.setCreatedBy(report.getCreatedBy());
        dto.setCreatedAt(report.getCreatedAt());
        dto.setApprovedBy(report.getApprovedBy());
        dto.setApprovedAt(report.getApprovedAt());
        
        return dto;
    }
}
