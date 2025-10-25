package com.example.buildsmart.exeption;

public class MonthlyReportException extends RuntimeException {

    public MonthlyReportException(String message) {
        super(message);
    }

    public MonthlyReportException(String message, Throwable cause) {
        super(message, cause);
    }
}
