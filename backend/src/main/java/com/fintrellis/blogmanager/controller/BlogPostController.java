package com.fintrellis.blogmanager.controller;

import com.fintrellis.blogmanager.BlogPost;
import com.fintrellis.blogmanager.dto.CreatePostRequest;
import com.fintrellis.blogmanager.dto.UpdatePostRequest;
import com.fintrellis.blogmanager.service.BlogPostService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import io.micronaut.validation.Validated;
import jakarta.inject.Inject;
import jakarta.validation.Valid;

import java.util.List;

@Controller("/api/posts") // Marks this class as a REST controller with base URL path "/api/posts"
@Validated // Enables validation for all methods in this controller
public class BlogPostController {

    @Inject // Injects the BlogPostService dependency using dependency injection
    private BlogPostService blogPostService; // Service layer instance to handle business logic

    // CREATE - Add new blog post
    @Post // Maps HTTP POST requests to this method
    public HttpResponse<BlogPost> createPost(@Valid @Body CreatePostRequest request) { // Validates request body and maps it to CreatePostRequest DTO
        BlogPost blogPost = convertToEntity(request); // Converts DTO to entity using helper method
        BlogPost createdPost = blogPostService.createPost(blogPost); // Calls service to persist the new post
        return HttpResponse.created(createdPost); // Returns HTTP 201 Created status with the created post
    }

    // READ - Get all posts
    @Get // Maps HTTP GET requests to this method
    public HttpResponse<List<BlogPost>> getAllPosts() { // Returns a list of all blog posts
        List<BlogPost> posts = blogPostService.getAllPosts(); // Retrieves all posts from service layer
        return HttpResponse.ok(posts); // Returns HTTP 200 OK with the posts list
    }

    // READ - Get all published posts (bonus feature)
    @Get("/published") // Maps GET requests to "/api/posts/published"
    public HttpResponse<List<BlogPost>> getAllPublishedPosts() { // Returns only published posts
        List<BlogPost> posts = blogPostService.getAllPublishedPosts(); // Gets published posts from service
        return HttpResponse.ok(posts); // Returns HTTP 200 OK with published posts
    }

    // READ - Get post by ID
    @Get("/{id}") // Maps GET requests with path variable to "/api/posts/{id}"
    public HttpResponse<BlogPost> getPostById(@PathVariable Long id) { // Extracts ID from URL path
        BlogPost post = blogPostService.getPostById(id); // Retrieves specific post by ID
        return HttpResponse.ok(post); // Returns HTTP 200 OK with the found post
    }

    // READ - Get post by ID with view count increment (bonus feature)
    @Get("/{id}/view") // Maps GET requests to "/api/posts/{id}/view"
    public HttpResponse<BlogPost> viewPost(@PathVariable Long id) { // Extracts post ID from URL
        BlogPost post = blogPostService.getPostByIdWithViewCount(id); // Gets post and increments view count
        return HttpResponse.ok(post); // Returns HTTP 200 OK with the post
    }

    // UPDATE - Update existing post
    @Put("/{id}") // Maps HTTP PUT requests to "/api/posts/{id}"
    public HttpResponse<BlogPost> updatePost(@PathVariable Long id, @Valid @Body UpdatePostRequest request) { // Gets ID from path and validates request body
        BlogPost updateData = convertToEntity(request); // Converts update request DTO to entity
        BlogPost updatedPost = blogPostService.updatePost(id, updateData); // Updates the post via service
        return HttpResponse.ok(updatedPost); // Returns HTTP 200 OK with updated post
    }

    // DELETE - Delete post by ID
    @Delete("/{id}") // Maps HTTP DELETE requests to "/api/posts/{id}"
    public HttpResponse<Void> deletePost(@PathVariable Long id) { // Extracts post ID to delete
        blogPostService.deletePost(id); // Deletes the post through service layer
        return HttpResponse.noContent(); // Returns HTTP 204 No Content (successful deletion)
    }

    // BONUS FEATURES - Search and Filter APIs

    // Search posts by title
    @Get("/search/title") // Maps GET requests to "/api/posts/search/title"
    public HttpResponse<List<BlogPost>> searchByTitle(@QueryValue String q) { // Gets search query from URL parameter
        List<BlogPost> posts = blogPostService.searchByTitle(q); // Searches posts by title containing query
        return HttpResponse.ok(posts); // Returns matching posts
    }

    // Search posts by content
    @Get("/search/content") // Maps GET requests to "/api/posts/search/content"
    public HttpResponse<List<BlogPost>> searchByContent(@QueryValue String q) { // Gets search query parameter
        List<BlogPost> posts = blogPostService.searchByContent(q); // Searches posts by content containing query
        return HttpResponse.ok(posts); // Returns matching posts
    }

    // Search posts by tags
    @Get("/search/tags") // Maps GET requests to "/api/posts/search/tags"
    public HttpResponse<List<BlogPost>> searchByTags(@QueryValue String q) { // Gets tag search query
        List<BlogPost> posts = blogPostService.searchByTags(q); // Searches posts by tags containing query
        return HttpResponse.ok(posts); // Returns posts with matching tags
    }

    // Get posts by author
    @Get("/author/{author}") // Maps GET requests to "/api/posts/author/{author}"
    public HttpResponse<List<BlogPost>> getPostsByAuthor(@PathVariable String author) { // Extracts author name from path
        List<BlogPost> posts = blogPostService.getPostsByAuthor(author); // Gets all posts by specific author
        return HttpResponse.ok(posts); // Returns author's posts
    }

    // Get most popular posts (by view count)
    @Get("/popular") // Maps GET requests to "/api/posts/popular"
    public HttpResponse<List<BlogPost>> getMostPopularPosts() { // Returns posts sorted by popularity
        List<BlogPost> posts = blogPostService.getMostPopularPosts(); // Gets posts ordered by view count
        return HttpResponse.ok(posts); // Returns most popular posts
    }

    // Toggle publish status
    @Put("/{id}/publish") // Maps PUT requests to "/api/posts/{id}/publish"
    public HttpResponse<BlogPost> togglePublishStatus(@PathVariable Long id) { // Gets post ID from path
        BlogPost post = blogPostService.togglePublishStatus(id); // Toggles published/unpublished status
        return HttpResponse.ok(post); // Returns updated post with new status
    }

    // ANALYTICS ENDPOINTS (bonus feature)

    @Get("/analytics/total") // Maps GET requests to "/api/posts/analytics/total"
    public HttpResponse<Long> getTotalPostsCount() { // Returns total count of all posts
        long count = blogPostService.getTotalPostsCount(); // Gets total post count from service
        return HttpResponse.ok(count); // Returns the count as HTTP 200
    }

    @Get("/analytics/published") // Maps GET requests to "/api/posts/analytics/published"
    public HttpResponse<Long> getPublishedPostsCount() { // Returns count of published posts only
        long count = blogPostService.getPublishedPostsCount(); // Gets published post count from service
        return HttpResponse.ok(count); // Returns the published count
    }

    @Get("/analytics/author/{author}") // Maps GET requests to "/api/posts/analytics/author/{author}"
    public HttpResponse<Long> getPostsCountByAuthor(@PathVariable String author) { // Gets author from path variable
        long count = blogPostService.getPostsCountByAuthor(author); // Gets post count for specific author
        return HttpResponse.ok(count); // Returns author's post count
    }

    // PRIVATE HELPER METHODS

    private BlogPost convertToEntity(CreatePostRequest request) { // Helper method to convert create request to entity
        BlogPost blogPost = new BlogPost(); // Creates new BlogPost instance
        blogPost.setTitle(request.getTitle()); // Sets title from request
        blogPost.setContent(request.getContent()); // Sets content from request
        blogPost.setSummary(request.getSummary()); // Sets summary from request
        blogPost.setAuthor(request.getAuthor()); // Sets author from request
        blogPost.setTags(request.getTags()); // Sets tags from request
        blogPost.setPublished(request.isPublished()); // Sets published status from request
        return blogPost; // Returns populated BlogPost entity
    }

    private BlogPost convertToEntity(UpdatePostRequest request) { // Helper method to convert update request to entity
        BlogPost blogPost = new BlogPost(); // Creates new BlogPost instance
        blogPost.setTitle(request.getTitle()); // Sets title from update request
        blogPost.setContent(request.getContent()); // Sets content from update request
        blogPost.setSummary(request.getSummary()); // Sets summary from update request
        blogPost.setAuthor(request.getAuthor()); // Sets author from update request
        blogPost.setTags(request.getTags()); // Sets tags from update request
        if (request.getPublished() != null) { // Checks if published status is provided in request
            blogPost.setPublished(request.getPublished()); // Sets published status only if not null
        }
        return blogPost; // Returns populated BlogPost entity
    }
}
