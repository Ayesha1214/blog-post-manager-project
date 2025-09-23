package com.fintrellis.blogmanager.dto; // Package declaration for DTO (Data Transfer Object) classes

import jakarta.validation.constraints.Size; // Import for validation - restricts field size/length
import io.micronaut.core.annotation.Introspected; // Import for Micronaut reflection optimization

@Introspected // Enables compile-time introspection for better performance in Micronaut
public class UpdatePostRequest { // DTO class for handling blog post update requests

    @Size(max = 200, message = "Title must be less than 200 characters") // Validation: title length cannot exceed 200 characters (but can be null for partial updates)
    private String title; // Field to store updated blog post title

    @Size(max = 10000, message = "Content must be less than 10000 characters") // Validation: content length cannot exceed 10000 characters (but can be null for partial updates)
    private String content; // Field to store updated blog post content

    @Size(max = 500, message = "Summary must be less than 500 characters") // Validation: summary length cannot exceed 500 characters (but can be null for partial updates)
    private String summary; // Field to store updated blog post summary

    private String author; // Field to store updated author name (no validation constraints, can be null)
    private String tags; // Field to store updated tags as string (no validation constraints, can be null)
    private Boolean published; // Field to store updated published status using Boolean wrapper (allows null values for partial updates)

    // Constructors
    public UpdatePostRequest() {} // Default no-argument constructor required for serialization/deserialization

    // Getters and Setters
    public String getTitle() { // Getter method for title field
        return title; // Returns the title value (can be null)
    }

    public void setTitle(String title) { // Setter method for title field
        this.title = title; // Sets the title value (can be null for partial updates)
    }

    public String getContent() { // Getter method for content field
        return content; // Returns the content value (can be null)
    }

    public void setContent(String content) { // Setter method for content field
        this.content = content; // Sets the content value (can be null for partial updates)
    }

    public String getSummary() { // Getter method for summary field
        return summary; // Returns the summary value (can be null)
    }

    public void setSummary(String summary) { // Setter method for summary field
        this.summary = summary; // Sets the summary value (can be null for partial updates)
    }

    public String getAuthor() { // Getter method for author field
        return author; // Returns the author value (can be null)
    }

    public void setAuthor(String author) { // Setter method for author field
        this.author = author; // Sets the author value (can be null for partial updates)
    }

    public String getTags() { // Getter method for tags field
        return tags; // Returns the tags value (can be null)
    }

    public void setTags(String tags) { // Setter method for tags field
        this.tags = tags; // Sets the tags value (can be null for partial updates)
    }

    public Boolean getPublished() { // Getter method for published field (uses Boolean wrapper to allow null)
        return published; // Returns the published status (can be null)
    }

    public void setPublished(Boolean published) { // Setter method for published field
        this.published = published; // Sets the published status (can be null for partial updates)
    }
}
