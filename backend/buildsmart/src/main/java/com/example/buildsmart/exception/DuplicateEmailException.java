package com.example.buildsmart.exception;

/**
 * exception thrown when duplicate email is detected
 */
public class DuplicateEmailException extends RuntimeException {
    public DuplicateEmailException(String message) {
        super(message);
    }
}
