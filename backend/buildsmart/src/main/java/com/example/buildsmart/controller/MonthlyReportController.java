package com.example.buildsmart.controller;

import com.example.buildsmart.Service.MonthlyReportService;
import com.example.buildsmart.Service.PDFReportService;
import com.example.buildsmart.dto.MonthlyReportDTO;
import com.example.buildsmart.dto.MonthlyReportSummaryDTO;
import com.example.buildsmart.exeption.MonthlyReportException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/monthly-reports")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Monthly Reports", description = "APIs for managing monthly construction reports")
public class MonthlyReportController {

    @Autowired
    private MonthlyReportService monthlyReportService;

    @Autowired
    private com.example.buildsmart.Service.MonthlyReportScheduler monthlyReportScheduler;

    @Autowired
    private PDFReportService pdfReportService;

    // Create a new monthly report
    @Operation(summary = "Create a new monthly report", description = "Creates a new monthly report for a project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Monthly report created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    @PostMapping
    public ResponseEntity<MonthlyReportDTO> createMonthlyReport(
            @Parameter(description = "Monthly report data") @Valid @RequestBody MonthlyReportDTO reportDTO,
            @Parameter(description = "User ID creating the report") @RequestHeader("X-User-Id") String userId) {
        try {
            MonthlyReportDTO createdReport = monthlyReportService.createMonthlyReport(reportDTO, userId);
            return new ResponseEntity<>(createdReport, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Generate monthly report from daily logs
    @Operation(summary = "Generate monthly report from daily logs", description = "Automatically generates a monthly report by aggregating daily logs for a specific month")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Monthly report generated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid parameters or no daily logs found"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    @PostMapping("/generate")
    public ResponseEntity<?> generateMonthlyReport(
            @Parameter(description = "Project ID") @RequestParam Long projectId,
            @Parameter(description = "Report year") @RequestParam Integer year,
            @Parameter(description = "Report month (1-12)") @RequestParam Integer month,
            @Parameter(description = "User ID generating the report") @RequestHeader("X-User-Id") String userId,
            @Parameter(description = "Overwrite existing report if it exists") @RequestParam(defaultValue = "false") boolean overwrite) {
        try {
            MonthlyReportDTO generatedReport = monthlyReportService.generateMonthlyReportFromDailyLogs(
                    projectId, year, month, userId, overwrite);
            
            // Check if this was an overwrite operation
            boolean wasOverwrite = generatedReport.getNotes() != null && 
                                 generatedReport.getNotes().contains("[OVERWRITTEN");
            
            Map<String, Object> response = Map.of(
                "report", generatedReport,
                "overwritten", wasOverwrite,
                "message", wasOverwrite ? "Monthly report overwritten successfully!" : "Monthly report generated successfully!"
            );
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (MonthlyReportException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to generate monthly report: " + e.getMessage()));
        }
    }

    // Generate monthly reports for all projects for a specific month
    @Operation(summary = "Generate monthly reports for all projects", description = "Generates monthly reports for all active projects for a specific month")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Monthly reports generated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request")
    })
    @PostMapping("/generate-all")
    public ResponseEntity<String> generateMonthlyReportsForAllProjects(
            @Parameter(description = "Report year") @RequestParam Integer year,
            @Parameter(description = "Report month (1-12)") @RequestParam Integer month) {
        try {
            monthlyReportScheduler.generateMonthlyReportsForMonth(year, month);
            return ResponseEntity.ok("Monthly reports generated successfully for " + year + "/" + month);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error generating monthly reports: " + e.getMessage());
        }
    }

    // Get all monthly reports
    @Operation(summary = "Get all monthly reports", description = "Retrieves all monthly reports")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Monthly reports retrieved successfully")
    })
    @GetMapping
    public ResponseEntity<List<MonthlyReportSummaryDTO>> getAllMonthlyReports(
            @Parameter(description = "User role for filtering") @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        try {
            List<MonthlyReportSummaryDTO> reports;
            if (userRole != null && !userRole.isEmpty()) {
                reports = monthlyReportService.getMonthlyReportsByRole(userRole);
            } else {
                reports = monthlyReportService.getAllMonthlyReports();
            }
            return new ResponseEntity<>(reports, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get monthly report by ID
    @Operation(summary = "Get monthly report by ID", description = "Retrieves a specific monthly report by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Monthly report found"),
            @ApiResponse(responseCode = "404", description = "Monthly report not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<MonthlyReportDTO> getMonthlyReportById(
            @Parameter(description = "Monthly report ID") @PathVariable Long id) {
        try {
            MonthlyReportDTO report = monthlyReportService.getMonthlyReportById(id);
            return new ResponseEntity<>(report, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Get all monthly reports for a project
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<MonthlyReportSummaryDTO>> getMonthlyReportsByProject(@PathVariable Long projectId) {
        try {
            List<MonthlyReportSummaryDTO> reports = monthlyReportService.getMonthlyReportsByProject(projectId);
            return new ResponseEntity<>(reports, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Get monthly reports by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<MonthlyReportSummaryDTO>> getMonthlyReportsByStatus(@PathVariable String status) {
        try {
            List<MonthlyReportSummaryDTO> reports = monthlyReportService.getMonthlyReportsByStatus(status);
            return new ResponseEntity<>(reports, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Get pending approval reports
    @GetMapping("/pending-approval")
    public ResponseEntity<List<MonthlyReportSummaryDTO>> getPendingApprovalReports() {
        try {
            List<MonthlyReportSummaryDTO> reports = monthlyReportService.getPendingApprovalReports();
            return new ResponseEntity<>(reports, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update monthly report
    @PutMapping("/{id}")
    public ResponseEntity<MonthlyReportDTO> updateMonthlyReport(
            @PathVariable Long id,
            @Valid @RequestBody MonthlyReportDTO reportDTO,
            @RequestHeader("X-User-Id") String userId) {
        try {
            MonthlyReportDTO updatedReport = monthlyReportService.updateMonthlyReport(id, reportDTO, userId);
            return new ResponseEntity<>(updatedReport, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Submit report for approval
    @PostMapping("/{id}/submit")
    public ResponseEntity<?> submitReport(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") String userId) {
        try {
            MonthlyReportDTO submittedReport = monthlyReportService.submitReport(id, userId);
            return new ResponseEntity<>(submittedReport, HttpStatus.OK);
        } catch (MonthlyReportException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to submit report: " + e.getMessage()));
        }
    }

    // Approve report
    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveReport(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") String userId) {
        try {
            MonthlyReportDTO approvedReport = monthlyReportService.approveReport(id, userId);
            return new ResponseEntity<>(approvedReport, HttpStatus.OK);
        } catch (MonthlyReportException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to approve report: " + e.getMessage()));
        }
    }

    // Reject report
    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectReport(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") String userId) {
        try {
            MonthlyReportDTO rejectedReport = monthlyReportService.rejectReport(id, userId);
            return new ResponseEntity<>(rejectedReport, HttpStatus.OK);
        } catch (MonthlyReportException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to reject report: " + e.getMessage()));
        }
    }

    // Get reports with high budget variance (disabled - no budget tracking)
    @GetMapping("/high-variance")
    public ResponseEntity<List<MonthlyReportSummaryDTO>> getReportsWithHighVariance(
            @RequestParam(defaultValue = "1000.00") BigDecimal threshold) {
        try {
            // Return empty list since budget tracking is disabled
            return new ResponseEntity<>(List.of(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete monthly report
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMonthlyReport(@PathVariable Long id) {
        try {
            monthlyReportService.deleteMonthlyReport(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Get monthly report statistics
    @GetMapping("/statistics")
    public ResponseEntity<Object> getMonthlyReportStatistics() {
        try {
            // This would typically return aggregated statistics
            // For now, returning a simple response
            return new ResponseEntity<>("Statistics endpoint - to be implemented", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get monthly report dashboard data
    @GetMapping("/dashboard")
    public ResponseEntity<Object> getDashboardData() {
        try {
            // This would return dashboard-specific data
            // For now, returning a simple response
            return new ResponseEntity<>("Dashboard endpoint - to be implemented", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Download monthly report as PDF
    @Operation(summary = "Download monthly report as PDF", description = "Downloads a specific monthly report as a PDF file")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "PDF report generated successfully"),
            @ApiResponse(responseCode = "404", description = "Monthly report not found"),
            @ApiResponse(responseCode = "500", description = "Error generating PDF")
    })
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadMonthlyReportPDF(
            @Parameter(description = "Monthly report ID") @PathVariable Long id) {
        try {
            MonthlyReportDTO report = monthlyReportService.getMonthlyReportById(id);
            if (report == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            byte[] pdfBytes = pdfReportService.generateMonthlyReportPDF(report);
            
            // Generate filename
            String filename = String.format("MonthlyReport_%s_%d_%02d.pdf", 
                report.getProjectName() != null ? report.getProjectName().replaceAll("[^a-zA-Z0-9]", "_") : "Project",
                report.getReportYear(),
                report.getReportMonth());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
