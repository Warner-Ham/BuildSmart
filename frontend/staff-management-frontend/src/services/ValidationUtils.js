/**
 * Validation utilities matching Java backend ValidationUtils
 */
class ValidationUtils {
    static isValidEmail(email) {
        const emailPattern = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return email && emailPattern.test(email.trim());
    }

    static isValidName(name) {
        const namePattern = /^[A-Za-z\s]{2,50}$/;
        return name && namePattern.test(name.trim());
    }

    static isValidPhoneNumber(phoneNumber) {
        const phonePattern = /^\+?[1-9]\d{1,14}$/;
        return phoneNumber && phonePattern.test(phoneNumber.trim().replace(/\s+/g, ''));
    }

    static isValidStaffId(staffId) {
        return staffId && !staffId.trim().isEmpty && staffId.startsWith('STAFF') && staffId.length > 5;
    }

    static isNotEmpty(value) {
        return value && value.trim() !== '';
    }
}

export default ValidationUtils;