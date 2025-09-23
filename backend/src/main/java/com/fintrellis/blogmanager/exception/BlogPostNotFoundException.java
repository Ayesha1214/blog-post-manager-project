package com.fintrellis.blogmanager.exception; // Package declaration for custom exception classes

public class BlogPostNotFoundException extends RuntimeException { // Custom exception class that extends RuntimeException for unchecked exceptions

    public BlogPostNotFoundException(String message) { // Constructor that accepts a custom error message
        super(message); // Calls parent RuntimeException constructor with the provided message
    }

    public BlogPostNotFoundException(Long id) { // Constructor that accepts a blog post ID and creates a standard message
        super("Blog post not found with id: " + id); // Calls parent constructor with formatted message including the ID
    }

    public BlogPostNotFoundException(String message, Throwable cause) { // Constructor that accepts both a message and the underlying cause of the exception
        super(message, cause); // Calls parent constructor with both message and cause for exception chaining
    }
}
