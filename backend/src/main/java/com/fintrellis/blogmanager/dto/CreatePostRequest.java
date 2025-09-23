package com.fintrellis.blogmanager.dto; // Package declaration for DTO (Data Transfer Object) classes

import jakarta.validation.constraints.NotBlank; // Import for validation - ensures field is not null or empty
import jakarta.validation.constraints.Size; // Import for validation - restricts field size/length
import io.micronaut.core.annotation.Introspected; // Import for Micronaut reflection optimization

@Introspected // Enables compile-time introspection for better performance in Micronaut
public class CreatePostRequest { // DTO class for handling blog post creation requests

    @NotBlank(message = "Title is required") // Validation: title cannot be null, empty, or whitespace only
    @Size(max = 200, message = "Title must be less than 200 characters") // Validation: title length cannot exceed 200 characters
    private String title; // Field to store blog post title

    @NotBlank(message = "Content is required") // Validation: content cannot be null, empty, or whitespace only
    @Size(max = 10000, message = "Content must be less than 10000 characters") // Validation: content length cannot exceed 10000 characters
    private String content; // Field to store blog post content

    @Size(max = 500, message = "Summary must be less than 500 characters") // Validation: summary length cannot exceed 500 characters (but can be null/empty)
    private String summary; // Field to store optional blog post summary

    private String author; // Field to store author name (no validation constraints)
    private String tags; // Field to store tags as string (no validation constraints)
    private boolean published = false; // Field to store published status, defaults to false (unpublished)

    // Constructors
    public CreatePostRequest() {} // Default no-argument constructor required for serialization/deserialization

    public CreatePostRequest(String title, String content) { // Convenience constructor with required fields
        this.title = title; // Sets the title field
        this.content = content; // Sets the content field
    }

    // Getters and Setters
    public String getTitle() { // Getter method for title field
        return title; // Returns the title value
    }

    public void setTitle(String title) { // Setter method for title field
        this.title = title; // Sets the title value
    }

    public String getContent() { // Getter method for content field
        return content; // Returns the content value
    }

    public void setContent(String content) { // Setter method for content field
        this.content = content; // Sets the content value
    }

    public String getSummary() { // Getter method for summary field
        return summary; // Returns the summary value
    }

    public void setSummary(String summary) { // Setter method for summary field
        this.summary = summary; // Sets the summary value
    }

    public String getAuthor() { // Getter method for author field
        return author; // Returns the author value
    }

    public void setAuthor(String author) { // Setter method for author field
        this.author = author; // Sets the author value
    }

    public String getTags() { // Getter method for tags field
        return tags; // Returns the tags value
    }

    public void setTags(String tags) { // Setter method for tags field
        this.tags = tags; // Sets the tags value
    }

    public boolean isPublished() { // Getter method for published field (uses 'is' prefix for boolean)
        return published; // Returns the published status
    }

    public void setPublished(boolean published) { // Setter method for published field
        this.published = published; // Sets the published status
    }
}
