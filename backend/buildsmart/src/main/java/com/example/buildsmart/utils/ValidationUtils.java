package com.example.buildsmart.utils;

import java.util.regex.Pattern;

/**
 * Utility class for validating input data
 */
public class ValidationUtils {

    //Email validation pattern
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    //Phone no. validation pattern (SriLankan format)
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\+?[1-9]\\d{1,14}$");

    //Name validation pattern (letters and spaces only, 2-50 characters)
    private static final Pattern NAME_PATTERN = Pattern.compile("^[A-Za-z\\s]{2,50}$");

    /**
     * Validate email format
     * @param email Email to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValidEmail(String email){
        return email != null &&
                !email.trim().isEmpty() &&
                EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    /**
     * Validate phone umber format
     * @param phoneNumber Phone number to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValidPhoneNumber(String phoneNumber){
        return phoneNumber != null &&
                !phoneNumber.trim().isEmpty() &&
                PHONE_PATTERN.matcher(phoneNumber.trim().replaceAll("\\s+", "")).matches();
    }

    /**
     * Validate name format (first name or last name)
     * @param name Name to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValidName(String name){
        return name != null &&
                !name.trim().isEmpty() &&
                NAME_PATTERN.matcher(name.trim()).matches();
    }

    /**
     * Validate staff ID format
     * @param staffId Staff ID to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValidStaffId(String staffId){
        return staffId != null &&
                !staffId.trim().isEmpty() &&
                staffId.startsWith("ST") &&
                staffId.length() > 5;
    }

    /**
     * Check if string is not null and not empty
     * @param value String to check
     * @return true if not nul and not empty, false otherwise
     */
    public static boolean isNotEmpty(String value){
        return value != null && !value.trim().isEmpty();
    }
}
