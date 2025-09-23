package com.fintrellis.blogmanager.service;

import com.fintrellis.blogmanager.BlogPost;
import com.fintrellis.blogmanager.repository.BlogPostRepository;
import com.fintrellis.blogmanager.exception.BlogPostNotFoundException;
import com.fintrellis.blogmanager.exception.ValidationException;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Singleton
public class BlogPostService {

    @Inject
    private BlogPostRepository blogPostRepository;

    // CREATE - Add new blog post
    @Transactional
    public BlogPost createPost(BlogPost blogPost) {
        validateBlogPost(blogPost);
        blogPost.setCreatedAt(LocalDateTime.now());
        blogPost.setUpdatedAt(LocalDateTime.now());
        return blogPostRepository.save(blogPost);
    }

    // READ - Get all posts
    public List<BlogPost> getAllPosts() {
        return blogPostRepository.findAll();
    }

    // READ - Get all published posts (bonus feature)
    public List<BlogPost> getAllPublishedPosts() {
        return blogPostRepository.findByPublishedTrueOrderByCreatedAtDesc();
    }

    // READ - Get post by ID
    public BlogPost getPostById(Long id) {
        return blogPostRepository.findById(id)
                .orElseThrow(() -> new BlogPostNotFoundException(id));
    }

    // READ - Get post by ID and increment view count (bonus feature)
    @Transactional
    public BlogPost getPostByIdWithViewCount(Long id) {
        BlogPost post = getPostById(id); // This will throw exception if not found
        post.incrementViewCount();
        return blogPostRepository.update(post);
    }

    // UPDATE - Update existing post
    @Transactional
    public BlogPost updatePost(Long id, BlogPost updatedPost) {
        BlogPost existingPost = getPostById(id); // This will throw exception if not found

        // Validate updated data
        if (updatedPost.getTitle() != null) {
            validateTitle(updatedPost.getTitle());
            existingPost.setTitle(updatedPost.getTitle());
        }

        if (updatedPost.getContent() != null) {
            validateContent(updatedPost.getContent());
            existingPost.setContent(updatedPost.getContent());
        }

        if (updatedPost.getSummary() != null) {
            existingPost.setSummary(updatedPost.getSummary());
        }

        if (updatedPost.getAuthor() != null) {
            existingPost.setAuthor(updatedPost.getAuthor());
        }

        if (updatedPost.getTags() != null) {
            existingPost.setTags(updatedPost.getTags());
        }

        existingPost.setPublished(updatedPost.isPublished());
        existingPost.setUpdatedAt(LocalDateTime.now());

        return blogPostRepository.update(existingPost);
    }

    // DELETE - Delete post by ID
    @Transactional
    public void deletePost(Long id) {
        BlogPost post = getPostById(id); // This will throw exception if not found
        blogPostRepository.delete(post);
    }

    // BONUS FEATURES

    // Search posts by title
    public List<BlogPost> searchByTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new ValidationException("Search title cannot be empty");
        }
        return blogPostRepository.findByTitleContainingIgnoreCase(title.trim());
    }

    // Search posts by content
    public List<BlogPost> searchByContent(String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new ValidationException("Search content cannot be empty");
        }
        return blogPostRepository.findByContentContainingIgnoreCase(content.trim());
    }

    // Search posts by tags
    public List<BlogPost> searchByTags(String tag) {
        if (tag == null || tag.trim().isEmpty()) {
            throw new ValidationException("Search tag cannot be empty");
        }
        return blogPostRepository.findByTagsContainingIgnoreCase(tag.trim());
    }

    // Get posts by author
    public List<BlogPost> getPostsByAuthor(String author) {
        if (author == null || author.trim().isEmpty()) {
            throw new ValidationException("Author name cannot be empty");
        }
        return blogPostRepository.findByAuthor(author.trim());
    }

    // Get most popular posts (by view count)
    public List<BlogPost> getMostPopularPosts() {
        return blogPostRepository.findByPublishedTrueOrderByViewCountDesc();
    }

    // Publish/unpublish post
    @Transactional
    public BlogPost togglePublishStatus(Long id) {
        BlogPost post = getPostById(id); // This will throw exception if not found
        post.setPublished(!post.isPublished());
        post.setUpdatedAt(LocalDateTime.now());
        return blogPostRepository.update(post);
    }

    // Get analytics data
    public long getTotalPostsCount() {
        return blogPostRepository.count();
    }

    public long getPublishedPostsCount() {
        return blogPostRepository.countByPublishedTrue();
    }

    public long getPostsCountByAuthor(String author) {
        if (author == null || author.trim().isEmpty()) {
            throw new ValidationException("Author name cannot be empty");
        }
        return blogPostRepository.countByAuthor(author.trim());
    }

    // PRIVATE VALIDATION METHODS

    private void validateBlogPost(BlogPost blogPost) {
        if (blogPost == null) {
            throw new ValidationException("Blog post cannot be null");
        }
        validateTitle(blogPost.getTitle());
        validateContent(blogPost.getContent());
    }

    private void validateTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new ValidationException("Title is required");
        }
        if (title.length() > 200) {
            throw new ValidationException("Title must be less than 200 characters");
        }
    }

    private void validateContent(String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new ValidationException("Content is required");
        }
        if (content.length() > 10000) {
            throw new ValidationException("Content must be less than 10000 characters");
        }
    }
}