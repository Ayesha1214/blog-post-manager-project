package com.fintrellis.blogmanager.exception; // Package declaration for custom exception classes

public class ValidationException extends RuntimeException { // Custom exception class that extends RuntimeException for unchecked validation errors

    public ValidationException(String message) { // Constructor that accepts a custom validation error message
        super(message); // Calls parent RuntimeException constructor with the provided validation message
    }

    public ValidationException(String message, Throwable cause) { // Constructor that accepts both a validation message and the underlying cause of the exception
        super(message, cause); // Calls parent constructor with both message and cause for exception chaining
    }
}
