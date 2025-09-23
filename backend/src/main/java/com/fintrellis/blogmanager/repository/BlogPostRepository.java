package com.fintrellis.blogmanager.repository; // Package declaration for repository layer classes

import com.fintrellis.blogmanager.BlogPost; // Import the BlogPost entity class
import io.micronaut.data.annotation.Repository; // Import Micronaut Data repository annotation
import io.micronaut.data.jpa.repository.JpaRepository; // Import JPA repository interface for basic CRUD operations

import java.util.List; // Import List interface for collections
import java.util.Optional; // Import Optional for nullable return values

@Repository // Marks this interface as a Micronaut Data repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> { // Repository interface extending JpaRepository with BlogPost entity and Long ID type

    // Basic CRUD operations are inherited from JpaRepository
    // Custom query methods for bonus features:

    List<BlogPost> findByPublishedTrue(); // Query method to find all blog posts where published field is true

    List<BlogPost> findByAuthor(String author); // Query method to find all blog posts by a specific author name

    List<BlogPost> findByTitleContainingIgnoreCase(String title); // Query method to find posts where title contains the given string (case-insensitive search)

    List<BlogPost> findByContentContainingIgnoreCase(String content); // Query method to find posts where content contains the given string (case-insensitive search)

    List<BlogPost> findByTagsContainingIgnoreCase(String tag); // Query method to find posts where tags field contains the given tag (case-insensitive search)

    List<BlogPost> findByPublishedTrueOrderByCreatedAtDesc(); // Query method to find all published posts ordered by creation date (newest first)

    List<BlogPost> findByPublishedTrueOrderByViewCountDesc(); // Query method to find all published posts ordered by view count (most viewed first)

    Optional<BlogPost> findByIdAndPublishedTrue(Long id); // Query method to find a specific post by ID only if it's published (returns Optional)

    long countByPublishedTrue(); // Query method to count total number of published posts

    long countByAuthor(String author); // Query method to count total number of posts by a specific author
}
