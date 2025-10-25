package com.example.buildsmart.service;

import com.example.buildsmart.dto.MonthlyReportDTO;
import com.example.buildsmart.model.DailyLog;
import com.example.buildsmart.repository.DailyLogRepository;
import com.example.buildsmart.repository.MonthlyReportRepository;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.TextAlignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PDFReportService {

    @Autowired
    private DailyLogRepository dailyLogRepository;

    @Autowired
    private MonthlyReportRepository monthlyReportRepository;

    public byte[] generateMonthlyReportPDF(MonthlyReportDTO report) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        
        try (PdfWriter writer = new PdfWriter(outputStream);
             PdfDocument pdf = new PdfDocument(writer);
             Document document = new Document(pdf)) {

            // Add title
            Paragraph title = new Paragraph("MONTHLY CONSTRUCTION REPORT")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(18)
                    .setBold()
                    .setMarginBottom(20);
            document.add(title);

            // Add company header
            Paragraph companyHeader = new Paragraph("BuildSmart Construction Management System")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(12)
                    .setMarginBottom(30);
            document.add(companyHeader);

            // Create main information table
            Table infoTable = new Table(2).useAllAvailableWidth();
            
            // Project Information
            infoTable.addCell(createHeaderCell("Project Information"));
            infoTable.addCell(createDataCell(""));
            
            infoTable.addCell(createLabelCell("Project Name:"));
            infoTable.addCell(createDataCell(report.getProjectName() != null ? report.getProjectName() : "N/A"));
            
            infoTable.addCell(createLabelCell("Project Location:"));
            infoTable.addCell(createDataCell(report.getProjectLocation() != null ? report.getProjectLocation() : "N/A"));
            
            infoTable.addCell(createLabelCell("Project Status:"));
            infoTable.addCell(createDataCell(report.getProjectStatus() != null ? report.getProjectStatus() : "N/A"));

            // Report Period
            infoTable.addCell(createHeaderCell("Report Period"));
            infoTable.addCell(createDataCell(""));
            
            infoTable.addCell(createLabelCell("Month/Year:"));
            String monthYear = getMonthName(report.getReportMonth()) + " " + report.getReportYear();
            infoTable.addCell(createDataCell(monthYear));
            
            infoTable.addCell(createLabelCell("Report Status:"));
            infoTable.addCell(createDataCell(report.getStatus()));

            // Financial Information
            infoTable.addCell(createHeaderCell("Financial Summary"));
            infoTable.addCell(createDataCell(""));
            
            infoTable.addCell(createLabelCell("Total Labor Cost:"));
            infoTable.addCell(createDataCell(formatCurrency(report.getTotalLaborCost())));
            
            infoTable.addCell(createLabelCell("Total Machinery Cost:"));
            infoTable.addCell(createDataCell(formatCurrency(report.getTotalMachineryCost())));
            
            infoTable.addCell(createLabelCell("Total Cost:"));
            infoTable.addCell(createDataCell(formatCurrency(report.getTotalCost())));
            
            infoTable.addCell(createLabelCell("Budget Variance:"));
            infoTable.addCell(createDataCell(formatCurrency(report.getBudgetVariance())));

            // Performance Metrics
            infoTable.addCell(createHeaderCell("Performance Metrics"));
            infoTable.addCell(createDataCell(""));
            
            infoTable.addCell(createLabelCell("Total Labor Hours:"));
            infoTable.addCell(createDataCell(formatHours(report.getTotalLaborHours())));
            
            infoTable.addCell(createLabelCell("Total Machinery Hours:"));
            infoTable.addCell(createDataCell(formatHours(report.getTotalMachineryHours())));
            
            infoTable.addCell(createLabelCell("Work Days:"));
            infoTable.addCell(createDataCell(report.getWorkDays() != null ? report.getWorkDays().toString() : "N/A"));
            
            infoTable.addCell(createLabelCell("Productivity Score:"));
            infoTable.addCell(createDataCell(formatPercentage(report.getProductivityScore())));

            // Report Metadata
            infoTable.addCell(createHeaderCell("Report Details"));
            infoTable.addCell(createDataCell(""));
            
            infoTable.addCell(createLabelCell("Created By:"));
            infoTable.addCell(createDataCell(report.getCreatedBy() != null ? report.getCreatedBy() : "N/A"));
            
            infoTable.addCell(createLabelCell("Created At:"));
            infoTable.addCell(createDataCell(formatDateTime(report.getCreatedAt())));
            
            if (report.getApprovedBy() != null) {
                infoTable.addCell(createLabelCell("Approved By:"));
                infoTable.addCell(createDataCell(report.getApprovedBy()));
                
                infoTable.addCell(createLabelCell("Approved At:"));
                infoTable.addCell(createDataCell(formatDateTime(report.getApprovedAt())));
            }

            document.add(infoTable);

            // Add enhanced analytics sections
            addCostBreakdownAnalysis(document, report);
            addProductivityAnalysis(document, report);
            addDailyPerformanceAnalysis(document, report);
            addResourceUtilizationAnalysis(document, report);
            addMaterialsAnalysis(document, report);
            addComparativeAnalysis(document, report);
            addEfficiencyMetrics(document, report);
            addProjectTimelineAnalysis(document, report);

            // Add notes if available
            if (report.getNotes() != null && !report.getNotes().trim().isEmpty()) {
                document.add(new Paragraph("\n"));
                Paragraph notesHeader = new Paragraph("Notes:")
                        .setBold()
                        .setMarginTop(20);
                document.add(notesHeader);
                
                Paragraph notes = new Paragraph(report.getNotes())
                        .setMarginTop(10)
                        .setMarginBottom(20);
                document.add(notes);
            }

            // Add footer
            Paragraph footer = new Paragraph("Generated on: " + java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(8)
                    .setMarginTop(30);
            document.add(footer);

        }
        
        return outputStream.toByteArray();
    }

    private Cell createHeaderCell(String text) {
        return new Cell()
                .add(new Paragraph(text).setBold())
                .setBackgroundColor(com.itextpdf.kernel.colors.ColorConstants.LIGHT_GRAY)
                .setPadding(8);
    }

    private Cell createLabelCell(String text) {
        return new Cell()
                .add(new Paragraph(text).setBold())
                .setPadding(8);
    }

    private Cell createDataCell(String text) {
        return new Cell()
                .add(new Paragraph(text != null ? text : "N/A"))
                .setPadding(8);
    }

    private String formatCurrency(java.math.BigDecimal amount) {
        if (amount == null) return "N/A";
        return "Rs. " + String.format("%,.2f", amount);
    }

    private String formatHours(Double hours) {
        if (hours == null) return "N/A";
        return String.format("%.2f hours", hours);
    }

    private String formatPercentage(Double percentage) {
        if (percentage == null) return "N/A";
        return String.format("%.1f%%", percentage);
    }

    private String formatDateTime(java.time.LocalDateTime dateTime) {
        if (dateTime == null) return "N/A";
        return dateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    private String getMonthName(Integer month) {
        if (month == null) return "N/A";
        String[] months = {
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        };
        return months[month - 1];
    }

    // Enhanced Analytics Methods

    private void addCostBreakdownAnalysis(Document document, MonthlyReportDTO report) {
        document.add(new Paragraph("\n"));
        Paragraph sectionHeader = new Paragraph("COST BREAKDOWN ANALYSIS")
                .setBold()
                .setFontSize(14)
                .setMarginTop(20)
                .setMarginBottom(10);
        document.add(sectionHeader);

        Table costTable = new Table(3).useAllAvailableWidth();
        costTable.addCell(createHeaderCell("Cost Category"));
        costTable.addCell(createHeaderCell("Amount"));
        costTable.addCell(createHeaderCell("Percentage"));

        BigDecimal totalCost = report.getTotalCost();
        if (totalCost != null && totalCost.compareTo(BigDecimal.ZERO) > 0) {
            // Labor Cost
            BigDecimal laborCost = report.getTotalLaborCost() != null ? report.getTotalLaborCost() : BigDecimal.ZERO;
            BigDecimal laborPercentage = laborCost.divide(totalCost, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
            costTable.addCell(createDataCell("Labor Cost"));
            costTable.addCell(createDataCell(formatCurrency(laborCost)));
            costTable.addCell(createDataCell(formatPercentage(laborPercentage.doubleValue())));

            // Machinery Cost
            BigDecimal machineryCost = report.getTotalMachineryCost() != null ? report.getTotalMachineryCost() : BigDecimal.ZERO;
            BigDecimal machineryPercentage = machineryCost.divide(totalCost, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
            costTable.addCell(createDataCell("Machinery Cost"));
            costTable.addCell(createDataCell(formatCurrency(machineryCost)));
            costTable.addCell(createDataCell(formatPercentage(machineryPercentage.doubleValue())));

            // Total
            costTable.addCell(createHeaderCell("TOTAL"));
            costTable.addCell(createHeaderCell(formatCurrency(totalCost)));
            costTable.addCell(createHeaderCell("100.0%"));
        }

        document.add(costTable);

        // Cost insights
        if (totalCost != null && totalCost.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal laborCost = report.getTotalLaborCost() != null ? report.getTotalLaborCost() : BigDecimal.ZERO;
            BigDecimal machineryCost = report.getTotalMachineryCost() != null ? report.getTotalMachineryCost() : BigDecimal.ZERO;
            
            String costInsight = generateCostInsight(laborCost, machineryCost, totalCost);
            if (!costInsight.isEmpty()) {
                Paragraph insight = new Paragraph("Cost Insight: " + costInsight)
                        .setItalic()
                        .setMarginTop(10)
                        .setFontSize(10);
                document.add(insight);
            }
        }
    }

    private void addProductivityAnalysis(Document document, MonthlyReportDTO report) {
        document.add(new Paragraph("\n"));
        Paragraph sectionHeader = new Paragraph("PRODUCTIVITY ANALYSIS")
                .setBold()
                .setFontSize(14)
                .setMarginTop(20)
                .setMarginBottom(10);
        document.add(sectionHeader);

        Table productivityTable = new Table(2).useAllAvailableWidth();
        productivityTable.addCell(createHeaderCell("Metric"));
        productivityTable.addCell(createHeaderCell("Value"));

        // Productivity Score
        productivityTable.addCell(createLabelCell("Overall Productivity Score:"));
        productivityTable.addCell(createDataCell(formatPercentage(report.getProductivityScore())));

        // Average Daily Hours
        if (report.getWorkDays() != null && report.getWorkDays() > 0) {
            Double totalHours = (report.getTotalLaborHours() != null ? report.getTotalLaborHours() : 0.0) + 
                               (report.getTotalMachineryHours() != null ? report.getTotalMachineryHours() : 0.0);
            Double avgDailyHours = totalHours / report.getWorkDays();
            productivityTable.addCell(createLabelCell("Average Daily Hours:"));
            productivityTable.addCell(createDataCell(String.format("%.2f hours/day", avgDailyHours)));

            // Labor Efficiency
            if (report.getTotalLaborHours() != null && report.getTotalLaborHours() > 0) {
                Double laborEfficiency = (report.getTotalLaborHours() / totalHours) * 100;
                productivityTable.addCell(createLabelCell("Labor Efficiency:"));
                productivityTable.addCell(createDataCell(formatPercentage(laborEfficiency)));
            }

            // Machinery Efficiency
            if (report.getTotalMachineryHours() != null && report.getTotalMachineryHours() > 0) {
                Double machineryEfficiency = (report.getTotalMachineryHours() / totalHours) * 100;
                productivityTable.addCell(createLabelCell("Machinery Efficiency:"));
                productivityTable.addCell(createDataCell(formatPercentage(machineryEfficiency)));
            }
        }

        document.add(productivityTable);
    }

    private void addDailyPerformanceAnalysis(Document document, MonthlyReportDTO report) {
        document.add(new Paragraph("\n"));
        Paragraph sectionHeader = new Paragraph("DAILY PERFORMANCE ANALYSIS")
                .setBold()
                .setFontSize(14)
                .setMarginTop(20)
                .setMarginBottom(10);
        document.add(sectionHeader);

        // Get daily logs for analysis
        LocalDate startDate = LocalDate.of(report.getReportYear(), report.getReportMonth(), 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        List<DailyLog> dailyLogs = dailyLogRepository.findByProjectIdAndLogDateBetween(report.getProjectId(), startDate, endDate);

        if (!dailyLogs.isEmpty()) {
            Table dailyTable = new Table(4).useAllAvailableWidth();
            dailyTable.addCell(createHeaderCell("Date"));
            dailyTable.addCell(createHeaderCell("Labor Hours"));
            dailyTable.addCell(createHeaderCell("Machinery Hours"));
            dailyTable.addCell(createHeaderCell("Total Hours"));

            // Sort by date
            dailyLogs.sort((a, b) -> a.getLogDate().compareTo(b.getLogDate()));

            Double maxDailyHours = 0.0;
            Double minDailyHours = Double.MAX_VALUE;
            LocalDate peakDay = null;
            LocalDate lowDay = null;

            for (DailyLog log : dailyLogs) {
                Double laborHours = log.getLaborHours() != null ? log.getLaborHours() : 0.0;
                Double machineryHours = log.getMachineryHours() != null ? log.getMachineryHours() : 0.0;
                Double totalHours = laborHours + machineryHours;

                dailyTable.addCell(createDataCell(log.getLogDate().toString()));
                dailyTable.addCell(createDataCell(formatHours(laborHours)));
                dailyTable.addCell(createDataCell(formatHours(machineryHours)));
                dailyTable.addCell(createDataCell(formatHours(totalHours)));

                if (totalHours > maxDailyHours) {
                    maxDailyHours = totalHours;
                    peakDay = log.getLogDate();
                }
                if (totalHours < minDailyHours) {
                    minDailyHours = totalHours;
                    lowDay = log.getLogDate();
                }
            }

            document.add(dailyTable);

            // Performance insights
            Paragraph insights = new Paragraph();
            insights.add("Performance Insights:\n");
            if (peakDay != null) {
                insights.add("• Peak performance day: " + peakDay + " (" + String.format("%.2f", maxDailyHours) + " hours)\n");
            }
            if (lowDay != null) {
                insights.add("• Lowest performance day: " + lowDay + " (" + String.format("%.2f", minDailyHours) + " hours)\n");
            }
            if (maxDailyHours > 0 && minDailyHours < Double.MAX_VALUE) {
                Double variance = ((maxDailyHours - minDailyHours) / maxDailyHours) * 100;
                insights.add("• Daily performance variance: " + String.format("%.1f", variance) + "%\n");
            }
            insights.setMarginTop(10).setFontSize(10);
            document.add(insights);
        } else {
            document.add(new Paragraph("No daily logs available for detailed analysis.")
                    .setItalic()
                    .setMarginTop(10));
        }
    }

    private void addResourceUtilizationAnalysis(Document document, MonthlyReportDTO report) {
        document.add(new Paragraph("\n"));
        Paragraph sectionHeader = new Paragraph("RESOURCE UTILIZATION ANALYSIS")
                .setBold()
                .setFontSize(14)
                .setMarginTop(20)
                .setMarginBottom(10);
        document.add(sectionHeader);

        Table resourceTable = new Table(3).useAllAvailableWidth();
        resourceTable.addCell(createHeaderCell("Resource Type"));
        resourceTable.addCell(createHeaderCell("Hours"));
        resourceTable.addCell(createHeaderCell("Cost per Hour"));

        // Labor analysis
        if (report.getTotalLaborHours() != null && report.getTotalLaborHours() > 0) {
            resourceTable.addCell(createDataCell("Labor"));
            resourceTable.addCell(createDataCell(formatHours(report.getTotalLaborHours())));
            
            BigDecimal laborCost = report.getTotalLaborCost() != null ? report.getTotalLaborCost() : BigDecimal.ZERO;
            BigDecimal laborCostPerHour = laborCost.divide(BigDecimal.valueOf(report.getTotalLaborHours()), 2, RoundingMode.HALF_UP);
            resourceTable.addCell(createDataCell(formatCurrency(laborCostPerHour) + "/hr"));
        }

        // Machinery analysis
        if (report.getTotalMachineryHours() != null && report.getTotalMachineryHours() > 0) {
            resourceTable.addCell(createDataCell("Machinery"));
            resourceTable.addCell(createDataCell(formatHours(report.getTotalMachineryHours())));
            
            BigDecimal machineryCost = report.getTotalMachineryCost() != null ? report.getTotalMachineryCost() : BigDecimal.ZERO;
            BigDecimal machineryCostPerHour = machineryCost.divide(BigDecimal.valueOf(report.getTotalMachineryHours()), 2, RoundingMode.HALF_UP);
            resourceTable.addCell(createDataCell(formatCurrency(machineryCostPerHour) + "/hr"));
        }

        document.add(resourceTable);

        // Resource balance analysis
        if (report.getTotalLaborHours() != null && report.getTotalMachineryHours() != null) {
            Double totalHours = report.getTotalLaborHours() + report.getTotalMachineryHours();
            if (totalHours > 0) {
                Double laborRatio = (report.getTotalLaborHours() / totalHours) * 100;
                Double machineryRatio = (report.getTotalMachineryHours() / totalHours) * 100;
                
                String balanceInsight = generateResourceBalanceInsight(laborRatio, machineryRatio);
                if (!balanceInsight.isEmpty()) {
                    Paragraph insight = new Paragraph("Resource Balance: " + balanceInsight)
                            .setItalic()
                            .setMarginTop(10)
                            .setFontSize(10);
                    document.add(insight);
                }
            }
        }
    }

    private void addMaterialsAnalysis(Document document, MonthlyReportDTO report) {
        document.add(new Paragraph("\n"));
        Paragraph sectionHeader = new Paragraph("MATERIALS ANALYSIS")
                .setBold()
                .setFontSize(14)
                .setMarginTop(20)
                .setMarginBottom(10);
        document.add(sectionHeader);

        // Get materials data from daily logs
        LocalDate startDate = LocalDate.of(report.getReportYear(), report.getReportMonth(), 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        List<DailyLog> dailyLogs = dailyLogRepository.findByProjectIdAndLogDateBetween(report.getProjectId(), startDate, endDate);

        if (!dailyLogs.isEmpty()) {
            // Count materials usage
            Map<String, Long> materialsCount = dailyLogs.stream()
                    .filter(log -> log.getMaterialsUsed() != null && !log.getMaterialsUsed().trim().isEmpty())
                    .collect(Collectors.groupingBy(
                            log -> log.getMaterialsUsed().toLowerCase().trim(),
                            Collectors.counting()
                    ));

            if (!materialsCount.isEmpty()) {
                Table materialsTable = new Table(2).useAllAvailableWidth();
                materialsTable.addCell(createHeaderCell("Material Type"));
                materialsTable.addCell(createHeaderCell("Usage Count"));

                materialsCount.entrySet().stream()
                        .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                        .forEach(entry -> {
                            materialsTable.addCell(createDataCell(capitalizeFirst(entry.getKey())));
                            materialsTable.addCell(createDataCell(entry.getValue().toString() + " days"));
                        });

                document.add(materialsTable);

                // Materials cost analysis
                BigDecimal materialsCost = report.getTotalMaterialsCost() != null ? report.getTotalMaterialsCost() : BigDecimal.ZERO;
                if (materialsCost.compareTo(BigDecimal.ZERO) > 0) {
                    Long totalUsageDays = materialsCount.values().stream().mapToLong(Long::longValue).sum();
                    if (totalUsageDays > 0) {
                        BigDecimal avgCostPerDay = materialsCost.divide(BigDecimal.valueOf(totalUsageDays), 2, RoundingMode.HALF_UP);
                        Paragraph costInsight = new Paragraph("Average materials cost per usage day: " + formatCurrency(avgCostPerDay))
                                .setItalic()
                                .setMarginTop(10)
                                .setFontSize(10);
                        document.add(costInsight);
                    }
                }
            } else {
                document.add(new Paragraph("No materials usage data recorded for this period.")
                        .setItalic()
                        .setMarginTop(10));
            }
        } else {
            document.add(new Paragraph("No daily logs available for materials analysis.")
                    .setItalic()
                    .setMarginTop(10));
        }
    }

    private void addComparativeAnalysis(Document document, MonthlyReportDTO report) {
        document.add(new Paragraph("\n"));
        Paragraph sectionHeader = new Paragraph("COMPARATIVE ANALYSIS")
                .setBold()
                .setFontSize(14)
                .setMarginTop(20)
                .setMarginBottom(10);
        document.add(sectionHeader);

        // Get previous month's report for comparison
        Integer prevMonth = report.getReportMonth() - 1;
        Integer prevYear = report.getReportYear();
        if (prevMonth <= 0) {
            prevMonth = 12;
            prevYear--;
        }

        Optional<com.example.buildsmart.model.MonthlyReport> previousReportOpt = monthlyReportRepository
                .findByProjectIdAndReportYearAndReportMonth(report.getProjectId(), prevYear, prevMonth);

        if (previousReportOpt.isPresent()) {
            com.example.buildsmart.model.MonthlyReport prevReport = previousReportOpt.get();
            
            Table comparisonTable = new Table(3).useAllAvailableWidth();
            comparisonTable.addCell(createHeaderCell("Metric"));
            comparisonTable.addCell(createHeaderCell("Current Month"));
            comparisonTable.addCell(createHeaderCell("Previous Month"));

            // Cost comparison
            comparisonTable.addCell(createLabelCell("Total Cost:"));
            comparisonTable.addCell(createDataCell(formatCurrency(report.getTotalCost())));
            comparisonTable.addCell(createDataCell(formatCurrency(prevReport.getTotalCost())));

            // Hours comparison
            comparisonTable.addCell(createLabelCell("Total Labor Hours:"));
            comparisonTable.addCell(createDataCell(formatHours(report.getTotalLaborHours())));
            comparisonTable.addCell(createDataCell(formatHours(prevReport.getTotalLaborHours())));

            comparisonTable.addCell(createLabelCell("Total Machinery Hours:"));
            comparisonTable.addCell(createDataCell(formatHours(report.getTotalMachineryHours())));
            comparisonTable.addCell(createDataCell(formatHours(prevReport.getTotalMachineryHours())));

            // Work days comparison
            comparisonTable.addCell(createLabelCell("Work Days:"));
            comparisonTable.addCell(createDataCell(report.getWorkDays() != null ? report.getWorkDays().toString() : "N/A"));
            comparisonTable.addCell(createDataCell(prevReport.getWorkDays() != null ? prevReport.getWorkDays().toString() : "N/A"));

            // Productivity comparison
            comparisonTable.addCell(createLabelCell("Productivity Score:"));
            comparisonTable.addCell(createDataCell(formatPercentage(report.getProductivityScore())));
            comparisonTable.addCell(createDataCell(formatPercentage(prevReport.getProductivityScore())));

            document.add(comparisonTable);

            // Generate comparison insights
            String comparisonInsight = generateComparisonInsight(report, prevReport);
            if (!comparisonInsight.isEmpty()) {
                Paragraph insight = new Paragraph("Month-over-Month Insight: " + comparisonInsight)
                        .setItalic()
                        .setMarginTop(10)
                        .setFontSize(10);
                document.add(insight);
            }
        } else {
            document.add(new Paragraph("No previous month data available for comparison.")
                    .setItalic()
                    .setMarginTop(10));
        }
    }

    private void addEfficiencyMetrics(Document document, MonthlyReportDTO report) {
        document.add(new Paragraph("\n"));
        Paragraph sectionHeader = new Paragraph("EFFICIENCY METRICS")
                .setBold()
                .setFontSize(14)
                .setMarginTop(20)
                .setMarginBottom(10);
        document.add(sectionHeader);

        Table efficiencyTable = new Table(2).useAllAvailableWidth();
        efficiencyTable.addCell(createHeaderCell("Efficiency Metric"));
        efficiencyTable.addCell(createHeaderCell("Value"));

        // Cost efficiency
        if (report.getTotalCost() != null && report.getWorkDays() != null && report.getWorkDays() > 0) {
            BigDecimal costPerDay = report.getTotalCost().divide(BigDecimal.valueOf(report.getWorkDays()), 2, RoundingMode.HALF_UP);
            efficiencyTable.addCell(createLabelCell("Cost per Work Day:"));
            efficiencyTable.addCell(createDataCell(formatCurrency(costPerDay)));
        }

        // Hours efficiency
        if (report.getWorkDays() != null && report.getWorkDays() > 0) {
            Double totalHours = (report.getTotalLaborHours() != null ? report.getTotalLaborHours() : 0.0) + 
                               (report.getTotalMachineryHours() != null ? report.getTotalMachineryHours() : 0.0);
            Double hoursPerDay = totalHours / report.getWorkDays();
            efficiencyTable.addCell(createLabelCell("Hours per Work Day:"));
            efficiencyTable.addCell(createDataCell(String.format("%.2f hours", hoursPerDay)));
        }

        // Cost per hour
        if (report.getTotalCost() != null) {
            Double totalHours = (report.getTotalLaborHours() != null ? report.getTotalLaborHours() : 0.0) + 
                               (report.getTotalMachineryHours() != null ? report.getTotalMachineryHours() : 0.0);
            if (totalHours > 0) {
                BigDecimal costPerHour = report.getTotalCost().divide(BigDecimal.valueOf(totalHours), 2, RoundingMode.HALF_UP);
                efficiencyTable.addCell(createLabelCell("Cost per Hour:"));
                efficiencyTable.addCell(createDataCell(formatCurrency(costPerHour)));
            }
        }

        // Resource utilization rate
        if (report.getWorkDays() != null && report.getWorkDays() > 0) {
            // Assuming 8 hours per day as standard
            Double maxPossibleHours = report.getWorkDays() * 8.0;
            Double actualHours = (report.getTotalLaborHours() != null ? report.getTotalLaborHours() : 0.0) + 
                                (report.getTotalMachineryHours() != null ? report.getTotalMachineryHours() : 0.0);
            if (maxPossibleHours > 0) {
                Double utilizationRate = (actualHours / maxPossibleHours) * 100;
                efficiencyTable.addCell(createLabelCell("Resource Utilization Rate:"));
                efficiencyTable.addCell(createDataCell(formatPercentage(utilizationRate)));
            }
        }

        document.add(efficiencyTable);
    }

    private void addProjectTimelineAnalysis(Document document, MonthlyReportDTO report) {
        document.add(new Paragraph("\n"));
        Paragraph sectionHeader = new Paragraph("PROJECT TIMELINE ANALYSIS")
                .setBold()
                .setFontSize(14)
                .setMarginTop(20)
                .setMarginBottom(10);
        document.add(sectionHeader);

        // Get all monthly reports for this project to show timeline
        List<com.example.buildsmart.model.MonthlyReport> allProjectReports = monthlyReportRepository
                .findByProjectIdOrderByReportYearDescReportMonthDesc(report.getProjectId());

        if (!allProjectReports.isEmpty()) {
            Table timelineTable = new Table(4).useAllAvailableWidth();
            timelineTable.addCell(createHeaderCell("Period"));
            timelineTable.addCell(createHeaderCell("Status"));
            timelineTable.addCell(createHeaderCell("Total Cost"));
            timelineTable.addCell(createHeaderCell("Productivity"));

            // Show last 6 months of reports
            allProjectReports.stream()
                    .limit(6)
                    .forEach(projectReport -> {
                        String period = getMonthName(projectReport.getReportMonth()) + " " + projectReport.getReportYear();
                        timelineTable.addCell(createDataCell(period));
                        timelineTable.addCell(createDataCell(projectReport.getStatus()));
                        timelineTable.addCell(createDataCell(formatCurrency(projectReport.getTotalCost())));
                        timelineTable.addCell(createDataCell(formatPercentage(projectReport.getProductivityScore())));
                    });

            document.add(timelineTable);

            // Timeline insights
            if (allProjectReports.size() >= 2) {
                com.example.buildsmart.model.MonthlyReport latest = allProjectReports.get(0);
                com.example.buildsmart.model.MonthlyReport previous = allProjectReports.get(1);
                
                Paragraph timelineInsight = new Paragraph();
                timelineInsight.add("Timeline Insights:\n");
                
                // Progress tracking
                if (latest.getTotalCost() != null && previous.getTotalCost() != null) {
                    BigDecimal costGrowth = latest.getTotalCost().subtract(previous.getTotalCost());
                    if (costGrowth.compareTo(BigDecimal.ZERO) > 0) {
                        timelineInsight.add("• Project costs are trending upward (+" + formatCurrency(costGrowth) + ")\n");
                    } else if (costGrowth.compareTo(BigDecimal.ZERO) < 0) {
                        timelineInsight.add("• Project costs are trending downward (" + formatCurrency(costGrowth.abs()) + ")\n");
                    } else {
                        timelineInsight.add("• Project costs remain stable\n");
                    }
                }
                
                // Productivity trend
                if (latest.getProductivityScore() != null && previous.getProductivityScore() != null) {
                    Double productivityChange = latest.getProductivityScore() - previous.getProductivityScore();
                    if (productivityChange > 0) {
                        timelineInsight.add("• Productivity is improving (+" + String.format("%.1f", productivityChange) + "%)\n");
                    } else if (productivityChange < 0) {
                        timelineInsight.add("• Productivity needs attention (" + String.format("%.1f", productivityChange) + "%)\n");
                    } else {
                        timelineInsight.add("• Productivity remains consistent\n");
                    }
                }
                
                // Project status summary
                long approvedReports = allProjectReports.stream()
                        .filter(r -> "APPROVED".equals(r.getStatus()))
                        .count();
                long totalReports = allProjectReports.size();
                
                timelineInsight.add("• " + approvedReports + " out of " + totalReports + " reports have been approved\n");
                
                // Current month position in timeline
                int currentPosition = 1;
                for (int i = 0; i < allProjectReports.size(); i++) {
                    if (allProjectReports.get(i).getId().equals(report.getId())) {
                        currentPosition = i + 1;
                        break;
                    }
                }
                timelineInsight.add("• This is the " + getOrdinal(currentPosition) + " report in the project timeline\n");
                
                timelineInsight.setMarginTop(10).setFontSize(10);
                document.add(timelineInsight);
            }
        } else {
            document.add(new Paragraph("This is the first report for this project. Timeline analysis will be available with subsequent reports.")
                    .setItalic()
                    .setMarginTop(10));
        }

        // Project completion estimation
        if (report.getWorkDays() != null && report.getWorkDays() > 0) {
            // Simple estimation based on current productivity
            Double totalHours = (report.getTotalLaborHours() != null ? report.getTotalLaborHours() : 0.0) + 
                               (report.getTotalMachineryHours() != null ? report.getTotalMachineryHours() : 0.0);
            Double avgHoursPerDay = totalHours / report.getWorkDays();
            
            if (avgHoursPerDay > 0) {
                // Assuming 8 hours per day as standard and estimating remaining work
                Double efficiency = (avgHoursPerDay / 8.0) * 100;
                
                Paragraph estimation = new Paragraph();
                estimation.add("Project Progress Estimation:\n");
                estimation.add("• Current daily efficiency: " + String.format("%.1f", efficiency) + "% of standard 8-hour day\n");
                
                if (efficiency > 100) {
                    estimation.add("• Project is ahead of schedule with high daily output\n");
                } else if (efficiency > 80) {
                    estimation.add("• Project is on track with good daily output\n");
                } else if (efficiency > 60) {
                    estimation.add("• Project may need acceleration to meet deadlines\n");
                } else {
                    estimation.add("• Project requires immediate attention to improve daily output\n");
                }
                
                estimation.setMarginTop(10).setFontSize(10);
                document.add(estimation);
            }
        }
    }

    // Helper methods for insights generation

    private String generateCostInsight(BigDecimal laborCost, BigDecimal machineryCost, BigDecimal totalCost) {
        if (totalCost.compareTo(BigDecimal.ZERO) == 0) return "";
        
        BigDecimal laborRatio = laborCost.divide(totalCost, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
        BigDecimal machineryRatio = machineryCost.divide(totalCost, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
        
        if (laborRatio.compareTo(BigDecimal.valueOf(70)) > 0) {
            return "Labor-intensive project with " + String.format("%.1f", laborRatio.doubleValue()) + "% labor costs.";
        } else if (machineryRatio.compareTo(BigDecimal.valueOf(70)) > 0) {
            return "Machinery-intensive project with " + String.format("%.1f", machineryRatio.doubleValue()) + "% machinery costs.";
        } else {
            return "Balanced resource allocation with " + String.format("%.1f", laborRatio.doubleValue()) + "% labor and " + 
                   String.format("%.1f", machineryRatio.doubleValue()) + "% machinery costs.";
        }
    }

    private String generateResourceBalanceInsight(Double laborRatio, Double machineryRatio) {
        if (Math.abs(laborRatio - machineryRatio) < 10) {
            return "Well-balanced resource utilization between labor and machinery.";
        } else if (laborRatio > machineryRatio) {
            return "Labor-focused approach with " + String.format("%.1f", laborRatio) + "% labor utilization.";
        } else {
            return "Machinery-focused approach with " + String.format("%.1f", machineryRatio) + "% machinery utilization.";
        }
    }

    private String generateComparisonInsight(MonthlyReportDTO current, com.example.buildsmart.model.MonthlyReport previous) {
        StringBuilder insight = new StringBuilder();
        
        // Cost comparison
        if (current.getTotalCost() != null && previous.getTotalCost() != null) {
            BigDecimal costChange = current.getTotalCost().subtract(previous.getTotalCost());
            BigDecimal costChangePercent = costChange.divide(previous.getTotalCost(), 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
            
            if (costChange.compareTo(BigDecimal.ZERO) > 0) {
                insight.append("Cost increased by ").append(formatCurrency(costChange.abs())).append(" (").append(String.format("%.1f", costChangePercent.doubleValue())).append("%). ");
            } else if (costChange.compareTo(BigDecimal.ZERO) < 0) {
                insight.append("Cost decreased by ").append(formatCurrency(costChange.abs())).append(" (").append(String.format("%.1f", costChangePercent.doubleValue())).append("%). ");
            } else {
                insight.append("Cost remained stable. ");
            }
        }
        
        // Productivity comparison
        if (current.getProductivityScore() != null && previous.getProductivityScore() != null) {
            Double productivityChange = current.getProductivityScore() - previous.getProductivityScore();
            if (productivityChange > 5) {
                insight.append("Productivity improved significantly (+").append(String.format("%.1f", productivityChange)).append("%). ");
            } else if (productivityChange < -5) {
                insight.append("Productivity declined (").append(String.format("%.1f", productivityChange)).append("%). ");
            } else {
                insight.append("Productivity remained stable. ");
            }
        }
        
        return insight.toString();
    }

    private String capitalizeFirst(String str) {
        if (str == null || str.isEmpty()) return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }

    private String getOrdinal(int number) {
        if (number >= 11 && number <= 13) {
            return number + "th";
        }
        switch (number % 10) {
            case 1: return number + "st";
            case 2: return number + "nd";
            case 3: return number + "rd";
            default: return number + "th";
        }
    }
}
