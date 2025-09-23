package com.fintrellis.blogmanager.dto; // Package declaration for DTO (Data Transfer Object) classes

import io.micronaut.core.annotation.Introspected; // Import for Micronaut reflection optimization
import java.time.LocalDateTime; // Import for handling date and time without timezone

@Introspected // Enables compile-time introspection for better performance in Micronaut
public class ErrorResponse { // DTO class for standardized error response format

    private String message; // Field to store the error message description
    private int status; // Field to store HTTP status code (e.g., 404, 500)
    private String error; // Field to store error type or category
    private LocalDateTime timestamp; // Field to store when the error occurred
    private String path; // Field to store the API endpoint path where error occurred

    // Constructors
    public ErrorResponse() { // Default no-argument constructor
        this.timestamp = LocalDateTime.now(); // Automatically sets timestamp to current date/time when error is created
    }

    public ErrorResponse(String message, int status, String error, String path) { // Parameterized constructor for complete error details
        this(); // Calls default constructor to set timestamp
        this.message = message; // Sets the error message
        this.status = status; // Sets the HTTP status code
        this.error = error; // Sets the error type
        this.path = path; // Sets the request path where error occurred
    }

    // Getters and Setters
    public String getMessage() { // Getter method for message field
        return message; // Returns the error message
    }

    public void setMessage(String message) { // Setter method for message field
        this.message = message; // Sets the error message
    }

    public int getStatus() { // Getter method for status field
        return status; // Returns the HTTP status code
    }

    public void setStatus(int status) { // Setter method for status field
        this.status = status; // Sets the HTTP status code
    }

    public String getError() { // Getter method for error field
        return error; // Returns the error type
    }

    public void setError(String error) { // Setter method for error field
        this.error = error; // Sets the error type
    }

    public LocalDateTime getTimestamp() { // Getter method for timestamp field
        return timestamp; // Returns when the error occurred
    }

    public void setTimestamp(LocalDateTime timestamp) { // Setter method for timestamp field
        this.timestamp = timestamp; // Sets when the error occurred
    }

    public String getPath() { // Getter method for path field
        return path; // Returns the request path where error occurred
    }

    public void setPath(String path) { // Setter method for path field
        this.path = path; // Sets the request path where error occurred
    }
}
