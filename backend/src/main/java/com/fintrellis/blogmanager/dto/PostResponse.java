package com.fintrellis.blogmanager.dto; // Package declaration for DTO (Data Transfer Object) classes

import io.micronaut.core.annotation.Introspected; // Import for Micronaut reflection optimization
import java.time.LocalDateTime; // Import for handling date and time without timezone

@Introspected // Enables compile-time introspection for better performance in Micronaut
public class PostResponse { // DTO class for sending blog post data back to clients

    private Long id; // Field to store unique identifier of the blog post
    private String title; // Field to store blog post title
    private String content; // Field to store blog post content/body
    private String summary; // Field to store optional blog post summary
    private String author; // Field to store author name
    private String tags; // Field to store tags associated with the post
    private LocalDateTime createdAt; // Field to store when the post was created
    private LocalDateTime updatedAt; // Field to store when the post was last updated
    private boolean published; // Field to store whether the post is published or draft
    private int viewCount; // Field to store number of times the post has been viewed

    // Constructors
    public PostResponse() {} // Default no-argument constructor required for serialization/deserialization

    public PostResponse(Long id, String title, String content, String summary, // Parameterized constructor with all fields
                        String author, String tags, LocalDateTime createdAt,
                        LocalDateTime updatedAt, boolean published, int viewCount) {
        this.id = id; // Sets the post ID
        this.title = title; // Sets the post title
        this.content = content; // Sets the post content
        this.summary = summary; // Sets the post summary
        this.author = author; // Sets the post author
        this.tags = tags; // Sets the post tags
        this.createdAt = createdAt; // Sets the creation timestamp
        this.updatedAt = updatedAt; // Sets the last update timestamp
        this.published = published; // Sets the published status
        this.viewCount = viewCount; // Sets the view count
    }

    // Getters and Setters
    public Long getId() { // Getter method for id field
        return id; // Returns the post ID
    }

    public void setId(Long id) { // Setter method for id field
        this.id = id; // Sets the post ID
    }

    public String getTitle() { // Getter method for title field
        return title; // Returns the post title
    }

    public void setTitle(String title) { // Setter method for title field
        this.title = title; // Sets the post title
    }

    public String getContent() { // Getter method for content field
        return content; // Returns the post content
    }

    public void setContent(String content) { // Setter method for content field
        this.content = content; // Sets the post content
    }

    public String getSummary() { // Getter method for summary field
        return summary; // Returns the post summary
    }

    public void setSummary(String summary) { // Setter method for summary field
        this.summary = summary; // Sets the post summary
    }

    public String getAuthor() { // Getter method for author field
        return author; // Returns the post author
    }

    public void setAuthor(String author) { // Setter method for author field
        this.author = author; // Sets the post author
    }

    public String getTags() { // Getter method for tags field
        return tags; // Returns the post tags
    }

    public void setTags(String tags) { // Setter method for tags field
        this.tags = tags; // Sets the post tags
    }

    public LocalDateTime getCreatedAt() { // Getter method for createdAt field
        return createdAt; // Returns when the post was created
    }

    public void setCreatedAt(LocalDateTime createdAt) { // Setter method for createdAt field
        this.createdAt = createdAt; // Sets when the post was created
    }

    public LocalDateTime getUpdatedAt() { // Getter method for updatedAt field
        return updatedAt; // Returns when the post was last updated
    }

    public void setUpdatedAt(LocalDateTime updatedAt) { // Setter method for updatedAt field
        this.updatedAt = updatedAt; // Sets when the post was last updated
    }

    public boolean isPublished() { // Getter method for published field (uses 'is' prefix for boolean)
        return published; // Returns whether the post is published
    }

    public void setPublished(boolean published) { // Setter method for published field
        this.published = published; // Sets whether the post is published
    }

    public int getViewCount() { // Getter method for viewCount field
        return viewCount; // Returns the number of views
    }

    public void setViewCount(int viewCount) { // Setter method for viewCount field
        this.viewCount = viewCount; // Sets the number of views
    }
}
