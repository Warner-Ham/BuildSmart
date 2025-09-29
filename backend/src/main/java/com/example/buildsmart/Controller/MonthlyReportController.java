package com.example.buildsmart.Controller;

import com.example.buildsmart.Service.MonthlyReportService;
import com.example.buildsmart.dto.MonthlyReportDTO;
import com.example.buildsmart.dto.MonthlyReportSummaryDTO;
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

@RestController
@RequestMapping("/api/monthly-reports")
@CrossOrigin(origins = "*")
@Tag(name = "Monthly Reports", description = "APIs for managing monthly construction reports")
public class MonthlyReportController {

    @Autowired
    private MonthlyReportService monthlyReportService;

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
    public ResponseEntity<MonthlyReportDTO> generateMonthlyReport(
            @Parameter(description = "Project ID") @RequestParam Long projectId,
            @Parameter(description = "Report year") @RequestParam Integer year,
            @Parameter(description = "Report month (1-12)") @RequestParam Integer month,
            @Parameter(description = "User ID generating the report") @RequestHeader("X-User-Id") String userId) {
        try {
            MonthlyReportDTO generatedReport = monthlyReportService.generateMonthlyReportFromDailyLogs(
                    projectId, year, month, userId);
            return new ResponseEntity<>(generatedReport, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
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
    public ResponseEntity<MonthlyReportDTO> submitReport(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") String userId) {
        try {
            MonthlyReportDTO submittedReport = monthlyReportService.submitReport(id, userId);
            return new ResponseEntity<>(submittedReport, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Approve report
    @PostMapping("/{id}/approve")
    public ResponseEntity<MonthlyReportDTO> approveReport(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") String userId) {
        try {
            MonthlyReportDTO approvedReport = monthlyReportService.approveReport(id, userId);
            return new ResponseEntity<>(approvedReport, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Reject report
    @PostMapping("/{id}/reject")
    public ResponseEntity<MonthlyReportDTO> rejectReport(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") String userId) {
        try {
            MonthlyReportDTO rejectedReport = monthlyReportService.rejectReport(id, userId);
            return new ResponseEntity<>(rejectedReport, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Get reports with high budget variance
    @GetMapping("/high-variance")
    public ResponseEntity<List<MonthlyReportSummaryDTO>> getReportsWithHighVariance(
            @RequestParam(defaultValue = "1000.00") BigDecimal threshold) {
        try {
            List<MonthlyReportSummaryDTO> reports = monthlyReportService.getReportsWithHighVariance(threshold);
            return new ResponseEntity<>(reports, HttpStatus.OK);
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
}
