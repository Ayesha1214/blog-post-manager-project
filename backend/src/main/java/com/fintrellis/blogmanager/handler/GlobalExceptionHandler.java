package com.fintrellis.blogmanager.handler; // Package declaration for exception handler classes

import com.fintrellis.blogmanager.dto.ErrorResponse; // Import custom ErrorResponse DTO
import com.fintrellis.blogmanager.exception.BlogPostNotFoundException; // Import custom BlogPostNotFoundException
import com.fintrellis.blogmanager.exception.ValidationException; // Import custom ValidationException
import io.micronaut.context.annotation.Requires; // Import for conditional bean creation
import io.micronaut.http.HttpRequest; // Import for HTTP request handling
import io.micronaut.http.HttpResponse; // Import for HTTP response creation
import io.micronaut.http.HttpStatus; // Import for HTTP status codes
import io.micronaut.http.annotation.Produces; // Import to indicate this bean produces responses
import io.micronaut.http.server.exceptions.ExceptionHandler; // Import for exception handling interface
import jakarta.inject.Singleton; // Import for singleton scope annotation

@Produces // Indicates this class produces HTTP responses
@Singleton // Marks this class as a singleton bean (one instance per application)
@Requires(classes = {BlogPostNotFoundException.class, ExceptionHandler.class}) // Only creates this bean if specified classes are present on classpath
public class GlobalExceptionHandler implements ExceptionHandler<Exception, HttpResponse<ErrorResponse>> { // Global exception handler that catches all exceptions and returns ErrorResponse

    @Override // Overrides the handle method from ExceptionHandler interface
    public HttpResponse<ErrorResponse> handle(HttpRequest request, Exception exception) { // Method to handle any exception thrown in the application

        ErrorResponse errorResponse = new ErrorResponse(); // Creates new ErrorResponse instance (timestamp is automatically set in constructor)
        errorResponse.setPath(request.getPath()); // Sets the request path where the exception occurred

        if (exception instanceof BlogPostNotFoundException) { // Checks if exception is BlogPostNotFoundException
            errorResponse.setMessage(exception.getMessage()); // Sets the exception message from BlogPostNotFoundException
            errorResponse.setStatus(HttpStatus.NOT_FOUND.getCode()); // Sets HTTP status code to 404
            errorResponse.setError("Not Found"); // Sets error type description
            return HttpResponse.notFound(errorResponse); // Returns HTTP 404 Not Found response with error details

        } else if (exception instanceof ValidationException) { // Checks if exception is custom ValidationException
            errorResponse.setMessage(exception.getMessage()); // Sets the exception message from ValidationException
            errorResponse.setStatus(HttpStatus.BAD_REQUEST.getCode()); // Sets HTTP status code to 400
            errorResponse.setError("Validation Error"); // Sets error type description
            return HttpResponse.badRequest(errorResponse); // Returns HTTP 400 Bad Request response with error details

        } else if (exception instanceof jakarta.validation.ConstraintViolationException) { // Checks if exception is Jakarta validation constraint violation
            errorResponse.setMessage("Validation failed: " + exception.getMessage()); // Sets message with validation failure prefix
            errorResponse.setStatus(HttpStatus.BAD_REQUEST.getCode()); // Sets HTTP status code to 400
            errorResponse.setError("Constraint Violation"); // Sets error type description
            return HttpResponse.badRequest(errorResponse); // Returns HTTP 400 Bad Request response with validation error details

        } else { // Handles any other unexpected exceptions
            // Generic server error
            errorResponse.setMessage("An unexpected error occurred"); // Sets generic error message for security (doesn't expose internal details)
            errorResponse.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.getCode()); // Sets HTTP status code to 500
            errorResponse.setError("Internal Server Error"); // Sets error type description
            return HttpResponse.serverError(errorResponse); // Returns HTTP 500 Internal Server Error response with generic error details
        }
    }
}
