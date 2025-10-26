package com.example.buildsmart.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.buildsmart.dto.MonthlyReportDTO;
import com.example.buildsmart.dto.MonthlyReportSummaryDTO;
import com.example.buildsmart.exeption.MonthlyReportException;
import com.example.buildsmart.model.DailyLog;
import com.example.buildsmart.model.MonthlyReport;
import com.example.buildsmart.model.Project;
import com.example.buildsmart.repository.DailyLogRepository;
import com.example.buildsmart.repository.MonthlyReportRepository;
import com.example.buildsmart.repository.ProjectBudgetRepository;
import com.example.buildsmart.repository.ProjectRepository;

@Service
@Transactional
public class MonthlyReportService {

    @Autowired
    private MonthlyReportRepository monthlyReportRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private DailyLogRepository dailyLogRepository;

    @Autowired
    private ProjectBudgetRepository projectBudgetRepository;

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
        monthlyReport.setTotalSubcontractorsCost(reportDTO.getTotalSubcontractorsCost());
        monthlyReport.setTotalOtherCosts(reportDTO.getTotalOtherCosts());
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
        return generateMonthlyReportFromDailyLogs(projectId, year, month, createdBy, false);
    }

    // Generate monthly report from daily logs with overwrite option
    public MonthlyReportDTO generateMonthlyReportFromDailyLogs(Long projectId, Integer year, Integer month, String createdBy, boolean overwrite) {
        // Validate project exists
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new MonthlyReportException("Project not found with ID: " + projectId));

        // Check if report already exists
        Optional<MonthlyReport> existingReport = monthlyReportRepository
                .findByProjectIdAndReportYearAndReportMonth(projectId, year, month);

        boolean isOverwrite = false;
        MonthlyReport existingReportEntity = null;
        if (existingReport.isPresent()) {
            if (overwrite) {
                // Get the existing report entity for potential update
                existingReportEntity = existingReport.get();
                isOverwrite = true;
                System.out.println("Overwriting existing monthly report for project: " + project.getName() + " for " + year + "/" + month);
            } else {
                throw new MonthlyReportException("Monthly report already exists for this project and period");
            }
        }

        // Get daily logs for the specified month
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        System.out.println("DEBUG: Looking for daily logs for project " + projectId + " between " + startDate + " and " + endDate);

        List<DailyLog> dailyLogs = dailyLogRepository.findByProjectIdAndLogDateBetween(projectId, startDate, endDate);

        System.out.println("DEBUG: Found " + dailyLogs.size() + " daily logs");

        if (dailyLogs.isEmpty()) {
            // Let's also check if there are any daily logs for this project at all
            List<DailyLog> allProjectLogs = dailyLogRepository.findByProjectId(projectId);
            System.out.println("DEBUG: Total daily logs for project " + projectId + ": " + allProjectLogs.size());

            if (allProjectLogs.isEmpty()) {
                throw new MonthlyReportException("No daily logs found for this project. Please create daily logs before generating monthly reports.");
            } else {
                throw new MonthlyReportException("No daily logs found for the specified period (" + startDate + " to " + endDate + "). Found " + allProjectLogs.size() + " logs for this project in other periods.");
            }
        }

        // Calculate totals from daily logs for labor and machinery hours
        Double totalLaborHours = 0.0;
        Double totalMachineryHours = 0.0;
        int workDays = dailyLogs.size();

        System.out.println("DEBUG: Processing " + dailyLogs.size() + " daily logs for hours calculation");

        for (DailyLog log : dailyLogs) {
            System.out.println("DEBUG: Processing log - Labor: " + log.getLaborHours() + ", Machinery: " + log.getMachineryHours());

            if (log.getLaborHours() != null && log.getLaborHours() > 0) {
                totalLaborHours += log.getLaborHours();
            }
            if (log.getMachineryHours() != null && log.getMachineryHours() > 0) {
                totalMachineryHours += log.getMachineryHours();
            }
        }

        // Calculate actual costs from project_budgets table for the specified month
        Date monthStartDate = java.sql.Date.valueOf(startDate);
        Date monthEndDate = java.sql.Date.valueOf(endDate);

        System.out.println("DEBUG: Calculating actual costs from project budgets for period " + monthStartDate + " to " + monthEndDate);

        // Get actual costs from project_budgets table
        Double materialsCostDouble = projectBudgetRepository.sumMaterialsCostsByProjectAndDateRange(projectId, monthStartDate, monthEndDate);
        Double machineryCostDouble = projectBudgetRepository.sumMachineryCostsByProjectAndDateRange(projectId, monthStartDate, monthEndDate);
        Double laborGeneralCostDouble = projectBudgetRepository.sumLaborGeneralCostsByProjectAndDateRange(projectId, monthStartDate, monthEndDate);
        Double laborSkilledCostDouble = projectBudgetRepository.sumLaborSkilledCostsByProjectAndDateRange(projectId, monthStartDate, monthEndDate);
        Double subcontractorsCostDouble = projectBudgetRepository.sumSubcontractorsCostsByProjectAndDateRange(projectId, monthStartDate, monthEndDate);
        Double otherCostsCostDouble = projectBudgetRepository.sumOtherCostsByProjectAndDateRange(projectId, monthStartDate, monthEndDate);

        // Convert to BigDecimal with null safety
        BigDecimal totalMaterialsCost = BigDecimal.valueOf(materialsCostDouble != null ? materialsCostDouble : 0.0);
        BigDecimal totalMachineryCost = BigDecimal.valueOf(machineryCostDouble != null ? machineryCostDouble : 0.0);
        BigDecimal totalLaborCost = BigDecimal.valueOf((laborGeneralCostDouble != null ? laborGeneralCostDouble : 0.0) +
                (laborSkilledCostDouble != null ? laborSkilledCostDouble : 0.0));
        BigDecimal totalSubcontractorsCost = BigDecimal.valueOf(subcontractorsCostDouble != null ? subcontractorsCostDouble : 0.0);
        BigDecimal totalOtherCosts = BigDecimal.valueOf(otherCostsCostDouble != null ? otherCostsCostDouble : 0.0);

        System.out.println("DEBUG: Calculated actual costs - Materials: $" + totalMaterialsCost +
                ", Machinery: $" + totalMachineryCost +
                ", Labor: $" + totalLaborCost + " (" + totalLaborHours + "h)" +
                ", Subcontractors: $" + totalSubcontractorsCost +
                ", Other: $" + totalOtherCosts +
                ", Total machinery hours: " + totalMachineryHours + "h");

        MonthlyReport monthlyReport;
        if (isOverwrite && existingReportEntity != null) {
            // Update existing report
            monthlyReport = existingReportEntity;
            monthlyReport.setTotalMaterialsCost(totalMaterialsCost);
            monthlyReport.setTotalLaborCost(totalLaborCost);
            monthlyReport.setTotalMachineryCost(totalMachineryCost);
            monthlyReport.setTotalSubcontractorsCost(totalSubcontractorsCost);
            monthlyReport.setTotalOtherCosts(totalOtherCosts);
            monthlyReport.setTotalLaborHours(totalLaborHours);
            monthlyReport.setTotalMachineryHours(totalMachineryHours);
            monthlyReport.setWorkDays(workDays);

            // Reset status to DRAFT when overwriting
            monthlyReport.setStatus("DRAFT");
            monthlyReport.setApprovedBy(null);
            monthlyReport.setApprovedAt(null);

            // Update timestamp
            monthlyReport.updateTimestamp(createdBy);
        } else {
            // Create new monthly report
            monthlyReport = new MonthlyReport(project, year, month, createdBy);
            monthlyReport.setTotalMaterialsCost(totalMaterialsCost);
            monthlyReport.setTotalLaborCost(totalLaborCost);
            monthlyReport.setTotalMachineryCost(totalMachineryCost);
            monthlyReport.setTotalSubcontractorsCost(totalSubcontractorsCost);
            monthlyReport.setTotalOtherCosts(totalOtherCosts);
            monthlyReport.setTotalLaborHours(totalLaborHours);
            monthlyReport.setTotalMachineryHours(totalMachineryHours);
            monthlyReport.setWorkDays(workDays);

            // Set initial status to DRAFT
            monthlyReport.setStatus("DRAFT");
        }

        // Calculate productivity score (simplified)
        if (workDays > 0) {
            double avgDailyHours = (totalLaborHours + totalMachineryHours) / workDays;
            monthlyReport.setProductivityScore(Math.min(100.0, avgDailyHours * 10)); // Simplified calculation
        }

        // Set budget variance to 0 (no budget tracking required)
        monthlyReport.setBudgetVariance(BigDecimal.ZERO);

        // Add notes about the generation
        String baseNotes = "Auto-generated from daily logs. Contains " + workDays + " work days with " +
                totalLaborHours + " labor hours and " + totalMachineryHours + " machinery hours.";
        if (isOverwrite) {
            monthlyReport.setNotes(baseNotes + " [OVERWRITTEN - Previous report was replaced]");
        } else {
            monthlyReport.setNotes(baseNotes);
        }

        monthlyReport.calculateTotals();

        System.out.println("DEBUG: About to save monthly report with total cost: $" + monthlyReport.getTotalCost());

        MonthlyReport savedReport = monthlyReportRepository.save(monthlyReport);

        System.out.println("DEBUG: Successfully saved monthly report with ID: " + savedReport.getId());

        MonthlyReportDTO result = convertToDTO(savedReport);
        return result;
    }

    // Get all monthly reports
    public List<MonthlyReportSummaryDTO> getAllMonthlyReports() {
        List<MonthlyReport> reports = monthlyReportRepository.findAll();
        return reports.stream()
                .map(this::convertToSummaryDTO)
                .collect(Collectors.toList());
    }


    // Get monthly reports based on user role
    public List<MonthlyReportSummaryDTO> getMonthlyReportsByRole(String userRole) {
        List<MonthlyReport> reports;

        switch (userRole) {
            case "Document Control Manager":
                // DCM can see all reports (draft, submitted, approved, rejected)
                reports = monthlyReportRepository.findAll();
                break;
            case "Site Manager":
                // Site Manager can see all reports (submitted, approved, rejected) for complete oversight
                reports = monthlyReportRepository.findAll();
                break;
            case "Admin":
                // Admin can see all reports
                reports = monthlyReportRepository.findAll();
                break;
            default:
                // Other staff can only see approved reports
                reports = monthlyReportRepository.findByStatusOrderByCreatedAtDesc("APPROVED");
                break;
        }

        return reports.stream()
                .map(this::convertToSummaryDTO)
                .collect(Collectors.toList());
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
        report.setTotalSubcontractorsCost(reportDTO.getTotalSubcontractorsCost());
        report.setTotalOtherCosts(reportDTO.getTotalOtherCosts());
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

    // Delete monthly report with role-based permissions
    public void deleteMonthlyReport(Long id, String userRole) {
        MonthlyReport report = monthlyReportRepository.findById(id)
                .orElseThrow(() -> new MonthlyReportException("Monthly report not found with ID: " + id));

        // Check permissions based on user role and report status
        if ("APPROVED".equals(report.getStatus())) {
            throw new MonthlyReportException("Cannot delete approved report");
        }

        // Site Manager can delete rejected reports
        if ("REJECTED".equals(report.getStatus()) && !"Site Manager".equals(userRole) && !"Admin".equals(userRole)) {
            throw new MonthlyReportException("Only Site Managers and Admins can delete rejected reports");
        }

        // Document Control Manager and Admin can delete draft reports
        if ("DRAFT".equals(report.getStatus()) && !"Document Control Manager".equals(userRole) && !"Admin".equals(userRole)) {
            throw new MonthlyReportException("Only Document Control Managers and Admins can delete draft reports");
        }

        monthlyReportRepository.deleteById(id);
    }

    // Get reports with high budget variance (disabled - no budget tracking)
    public List<MonthlyReportSummaryDTO> getReportsWithHighVariance(BigDecimal threshold) {
        // Return empty list since budget tracking is disabled
        return List.of();
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
        dto.setTotalSubcontractorsCost(report.getTotalSubcontractorsCost());
        dto.setTotalOtherCosts(report.getTotalOtherCosts());
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
