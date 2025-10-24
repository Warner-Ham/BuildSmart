package com.example.buildsmart.service;

import com.example.buildsmart.dto.MonthlyReportDTO;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.TextAlignment;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

@Service
public class PDFReportService {

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
}
