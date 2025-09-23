package com.fintrellis.blogmanager.service;

import com.fintrellis.blogmanager.BlogPost;
import com.fintrellis.blogmanager.exception.BlogPostNotFoundException;
import com.fintrellis.blogmanager.exception.ValidationException;
import com.fintrellis.blogmanager.repository.BlogPostRepository;
import io.micronaut.test.extensions.junit5.annotation.MicronautTest; // Correct import for @MicronautTest
import jakarta.inject.Inject;
import org.junit.jupiter.api.BeforeEach; // Correct import for @BeforeEach
import org.junit.jupiter.api.Test; // Correct import for @Test
import org.mockito.InjectMocks; // Correct import for @InjectMocks
import org.mockito.Mock; // Correct import for @Mock
import org.mockito.MockitoAnnotations; // Correct import for MockitoAnnotations

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*; // Correct static import for JUnit Assertions
import static org.mockito.ArgumentMatchers.any; // Correct static import for Mockito ArgumentMatchers
import static org.mockito.Mockito.*; // Correct static import for Mockito methods like when, verify, mock

@MicronautTest // Indicates this is a Micronaut test
class BlogPostServiceTest {

    @Mock // Mock the repository dependency
    private BlogPostRepository blogPostRepository;

    @InjectMocks // Inject mocks into the service under test
    private BlogPostService blogPostService;

    @BeforeEach
    void setUp() {
        // Initialize mocks before each test
        MockitoAnnotations.openMocks(this);
        // Manually inject the mock repository into the service if @InjectMocks isn't enough
        // blogPostService = new BlogPostService(blogPostRepository); // If constructor injection
        // For field injection with @InjectMocks, MockitoAnnotations.openMocks(this) is key
    }

    @Test
    void testCreatePost_success() {
        BlogPost newPost = new BlogPost("Test Title", "Test Content");
        newPost.setAuthor("Test Author");
        newPost.setPublished(true);

        when(blogPostRepository.save(any(BlogPost.class))).thenReturn(newPost);

        BlogPost createdPost = blogPostService.createPost(newPost);

        assertNotNull(createdPost);
        assertEquals("Test Title", createdPost.getTitle());
        verify(blogPostRepository, times(1)).save(any(BlogPost.class));
    }

    @Test
    void testCreatePost_validationFailure_titleRequired() {
        BlogPost invalidPost = new BlogPost("", "Content");

        ValidationException thrown = assertThrows(ValidationException.class, () -> {
            blogPostService.createPost(invalidPost);
        });
        assertEquals("Title is required", thrown.getMessage());
        verify(blogPostRepository, never()).save(any(BlogPost.class));
    }

    @Test
    void testGetAllPosts_success() {
        BlogPost post1 = new BlogPost("Title 1", "Content 1");
        BlogPost post2 = new BlogPost("Title 2", "Content 2");
        when(blogPostRepository.findAll()).thenReturn(Arrays.asList(post1, post2));

        List<BlogPost> posts = blogPostService.getAllPosts();

        assertNotNull(posts);
        assertEquals(2, posts.size());
        verify(blogPostRepository, times(1)).findAll();
    }

    @Test
    void testGetPostById_success() {
        BlogPost post = new BlogPost("Title", "Content");
        post.setId(1L);
        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(post));

        BlogPost foundPost = blogPostService.getPostById(1L);

        assertNotNull(foundPost);
        assertEquals(1L, foundPost.getId());
        verify(blogPostRepository, times(1)).findById(1L);
    }

    @Test
    void testGetPostById_notFound() {
        when(blogPostRepository.findById(1L)).thenReturn(Optional.empty());

        BlogPostNotFoundException thrown = assertThrows(BlogPostNotFoundException.class, () -> {
            blogPostService.getPostById(1L);
        });
        assertEquals("Blog post not found with id: 1", thrown.getMessage());
        verify(blogPostRepository, times(1)).findById(1L);
    }

    @Test
    void testUpdatePost_success() {
        BlogPost existingPost = new BlogPost("Old Title", "Old Content");
        existingPost.setId(1L);
        existingPost.setUpdatedAt(LocalDateTime.now().minusDays(1));

        BlogPost updatedDetails = new BlogPost("New Title", "New Content");
        updatedDetails.setSummary("New Summary");
        updatedDetails.setPublished(true);

        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(existingPost));
        when(blogPostRepository.update(any(BlogPost.class))).thenReturn(existingPost); // Mockito will return the modified existingPost

        BlogPost result = blogPostService.updatePost(1L, updatedDetails);

        assertNotNull(result);
        assertEquals("New Title", result.getTitle());
        assertEquals("New Content", result.getContent());
        assertTrue(result.isPublished());
        assertNotNull(result.getUpdatedAt()); // Should be updated
        verify(blogPostRepository, times(1)).findById(1L);
        verify(blogPostRepository, times(1)).update(any(BlogPost.class));
    }

    @Test
    void testUpdatePost_notFound() {
        BlogPost updatedDetails = new BlogPost("New Title", "New Content");
        when(blogPostRepository.findById(1L)).thenReturn(Optional.empty());

        BlogPostNotFoundException thrown = assertThrows(BlogPostNotFoundException.class, () -> {
            blogPostService.updatePost(1L, updatedDetails);
        });
        assertEquals("Blog post not found with id: 1", thrown.getMessage());
        verify(blogPostRepository, never()).update(any(BlogPost.class));
    }

    @Test
    void testDeletePost_success() {
        BlogPost postToDelete = new BlogPost("Title", "Content");
        postToDelete.setId(1L);
        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(postToDelete));
        doNothing().when(blogPostRepository).delete(any(BlogPost.class));

        assertDoesNotThrow(() -> blogPostService.deletePost(1L));
        verify(blogPostRepository, times(1)).findById(1L);
        verify(blogPostRepository, times(1)).delete(postToDelete);
    }

    @Test
    void testDeletePost_notFound() {
        when(blogPostRepository.findById(1L)).thenReturn(Optional.empty());

        BlogPostNotFoundException thrown = assertThrows(BlogPostNotFoundException.class, () -> {
            blogPostService.deletePost(1L);
        });
        assertEquals("Blog post not found with id: 1", thrown.getMessage());
        verify(blogPostRepository, never()).delete(any(BlogPost.class));
    }

    @Test
    void testGetPostByIdWithViewCount_success() {
        BlogPost post = new BlogPost("Title", "Content");
        post.setId(1L);
        post.setViewCount(5);
        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(post));
        when(blogPostRepository.update(any(BlogPost.class))).thenReturn(post);

        BlogPost result = blogPostService.getPostByIdWithViewCount(1L);

        assertNotNull(result);
        assertEquals(6, result.getViewCount()); // View count should increment
        verify(blogPostRepository, times(1)).findById(1L);
        verify(blogPostRepository, times(1)).update(any(BlogPost.class));
    }

    @Test
    void testSearchByTitle_success() {
        BlogPost post = new BlogPost("Searchable Title", "Content");
        when(blogPostRepository.findByTitleContainingIgnoreCase("search")).thenReturn(List.of(post));

        List<BlogPost> results = blogPostService.searchByTitle("search");

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals("Searchable Title", results.get(0).getTitle());
        verify(blogPostRepository, times(1)).findByTitleContainingIgnoreCase("search");
    }

    @Test
    void testSearchByTitle_emptyQuery() {
        ValidationException thrown = assertThrows(ValidationException.class, () -> {
            blogPostService.searchByTitle("");
        });
        assertEquals("Search title cannot be empty", thrown.getMessage());
        verify(blogPostRepository, never()).findByTitleContainingIgnoreCase(anyString());
    }
}
