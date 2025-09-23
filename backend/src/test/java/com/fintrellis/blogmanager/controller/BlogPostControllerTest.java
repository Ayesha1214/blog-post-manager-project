package com.fintrellis.blogmanager.controller;

import com.fintrellis.blogmanager.BlogPost;
import com.fintrellis.blogmanager.dto.CreatePostRequest;
import com.fintrellis.blogmanager.dto.UpdatePostRequest;
import com.fintrellis.blogmanager.exception.BlogPostNotFoundException;
import com.fintrellis.blogmanager.service.BlogPostService;
import io.micronaut.core.type.Argument;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.client.HttpClient;
import io.micronaut.http.client.annotation.Client;
import io.micronaut.http.client.exceptions.HttpClientResponseException;
import io.micronaut.test.annotation.MockBean;
import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@MicronautTest(environments = "test")
class BlogPostControllerTest {

    @Inject
    @Client("/")
    HttpClient client;

    @MockBean(BlogPostService.class)
    BlogPostService blogPostService() {
        return mock(BlogPostService.class);
    }

    @Inject
    BlogPostService mockedBlogPostService;

    @Test
    void testCreatePost_success() {
        CreatePostRequest request = new CreatePostRequest("New Title", "New Content");
        request.setAuthor("Test Author");
        request.setPublished(true);

        BlogPost createdPost = new BlogPost("New Title", "New Content");
        createdPost.setId(1L);
        createdPost.setAuthor("Test Author");
        createdPost.setPublished(true);

        when(mockedBlogPostService.createPost(any(BlogPost.class))).thenReturn(createdPost);

        HttpResponse<BlogPost> response = client.toBlocking().exchange(
                HttpRequest.POST("/api/posts", request), BlogPost.class);

        assertEquals(HttpStatus.CREATED, response.getStatus());
        assertNotNull(response.getBody().orElse(null));
        assertEquals(1L, response.getBody().get().getId());
        assertEquals("New Title", response.getBody().get().getTitle());
        verify(mockedBlogPostService, times(1)).createPost(any(BlogPost.class));
    }

    @Test
    void testCreatePost_validationFailure() {
        CreatePostRequest request = new CreatePostRequest("", "Content"); // Invalid title

        HttpClientResponseException thrown = assertThrows(HttpClientResponseException.class, () -> {
            client.toBlocking().exchange(HttpRequest.POST("/api/posts", request), BlogPost.class);
        });

        assertEquals(HttpStatus.BAD_REQUEST, thrown.getStatus());
        // Don't check specific error message content - just verify it's a bad request
        verify(mockedBlogPostService, never()).createPost(any(BlogPost.class));
    }

    @Test
    void testGetAllPosts_success() {
        BlogPost post1 = new BlogPost("Title 1", "Content 1");
        BlogPost post2 = new BlogPost("Title 2", "Content 2");
        when(mockedBlogPostService.getAllPosts()).thenReturn(Arrays.asList(post1, post2));

        HttpResponse<List<BlogPost>> response = client.toBlocking().exchange(
                HttpRequest.GET("/api/posts"),
                Argument.listOf(BlogPost.class));

        assertEquals(HttpStatus.OK, response.getStatus());
        assertNotNull(response.getBody().orElse(null));
        assertEquals(2, response.getBody().get().size());
        verify(mockedBlogPostService, times(1)).getAllPosts();
    }

    @Test
    void testGetPostById_success() {
        BlogPost post = new BlogPost("Test Post", "Content");
        post.setId(1L);
        when(mockedBlogPostService.getPostById(1L)).thenReturn(post);

        HttpResponse<BlogPost> response = client.toBlocking().exchange(
                HttpRequest.GET("/api/posts/1"), BlogPost.class);

        assertEquals(HttpStatus.OK, response.getStatus());
        assertNotNull(response.getBody().orElse(null));
        assertEquals(1L, response.getBody().get().getId());
        verify(mockedBlogPostService, times(1)).getPostById(1L);
    }

    @Test
    void testGetPostById_notFound() {
        when(mockedBlogPostService.getPostById(anyLong())).thenThrow(new BlogPostNotFoundException(999L));

        HttpClientResponseException thrown = assertThrows(HttpClientResponseException.class, () -> {
            client.toBlocking().exchange(HttpRequest.GET("/api/posts/999"), BlogPost.class);
        });

        assertEquals(HttpStatus.NOT_FOUND, thrown.getStatus());
        // Just verify the service was called - don't check error message format
        verify(mockedBlogPostService, times(1)).getPostById(999L);
    }

    @Test
    void testUpdatePost_success() {
        UpdatePostRequest request = new UpdatePostRequest();
        request.setTitle("Updated Title");
        request.setContent("Updated Content");

        BlogPost updatedPost = new BlogPost("Updated Title", "Updated Content");
        updatedPost.setId(1L);

        when(mockedBlogPostService.updatePost(anyLong(), any(BlogPost.class))).thenReturn(updatedPost);

        HttpResponse<BlogPost> response = client.toBlocking().exchange(
                HttpRequest.PUT("/api/posts/1", request), BlogPost.class);

        assertEquals(HttpStatus.OK, response.getStatus());
        assertNotNull(response.getBody().orElse(null));
        assertEquals(1L, response.getBody().get().getId());
        assertEquals("Updated Title", response.getBody().get().getTitle());
        verify(mockedBlogPostService, times(1)).updatePost(eq(1L), any(BlogPost.class));
    }

    @Test
    void testUpdatePost_notFound() {
        UpdatePostRequest request = new UpdatePostRequest();
        request.setTitle("Updated Title");

        when(mockedBlogPostService.updatePost(anyLong(), any(BlogPost.class)))
                .thenThrow(new BlogPostNotFoundException(999L));

        HttpClientResponseException thrown = assertThrows(HttpClientResponseException.class, () -> {
            client.toBlocking().exchange(HttpRequest.PUT("/api/posts/999", request), BlogPost.class);
        });

        assertEquals(HttpStatus.NOT_FOUND, thrown.getStatus());
        // Just verify the service was called - don't check error message format
        verify(mockedBlogPostService, times(1)).updatePost(eq(999L), any(BlogPost.class));
    }

    @Test
    void testDeletePost_success() {
        doNothing().when(mockedBlogPostService).deletePost(1L);

        HttpResponse<Void> response = client.toBlocking().exchange(
                HttpRequest.DELETE("/api/posts/1"));

        assertEquals(HttpStatus.NO_CONTENT, response.getStatus());
        verify(mockedBlogPostService, times(1)).deletePost(1L);
    }

    @Test
    void testDeletePost_notFound() {
        doThrow(new BlogPostNotFoundException(999L)).when(mockedBlogPostService).deletePost(anyLong());

        HttpClientResponseException thrown = assertThrows(HttpClientResponseException.class, () -> {
            client.toBlocking().exchange(HttpRequest.DELETE("/api/posts/999"));
        });

        assertEquals(HttpStatus.NOT_FOUND, thrown.getStatus());
        // Just verify the service was called - don't check error message format
        verify(mockedBlogPostService, times(1)).deletePost(999L);
    }

    @Test
    void testSearchByTitle_success() {
        BlogPost post = new BlogPost("Test Search", "Content");
        when(mockedBlogPostService.searchByTitle(anyString())).thenReturn(List.of(post));

        HttpResponse<List<BlogPost>> response = client.toBlocking().exchange(
                HttpRequest.GET("/api/posts/search/title?q=test"),
                Argument.listOf(BlogPost.class));

        assertEquals(HttpStatus.OK, response.getStatus());
        assertNotNull(response.getBody().orElse(null));
        assertEquals(1, response.getBody().get().size());
        verify(mockedBlogPostService, times(1)).searchByTitle("test");
    }

    @Test
    void testGetAllPublishedPosts_success() {
        BlogPost post1 = new BlogPost("Published 1", "Content 1");
        post1.setPublished(true);
        BlogPost post2 = new BlogPost("Published 2", "Content 2");
        post2.setPublished(true);

        when(mockedBlogPostService.getAllPublishedPosts()).thenReturn(Arrays.asList(post1, post2));

        HttpResponse<List<BlogPost>> response = client.toBlocking().exchange(
                HttpRequest.GET("/api/posts/published"),
                Argument.listOf(BlogPost.class));

        assertEquals(HttpStatus.OK, response.getStatus());
        assertNotNull(response.getBody().orElse(null));
        assertEquals(2, response.getBody().get().size());
        verify(mockedBlogPostService, times(1)).getAllPublishedPosts();
    }

    @Test
    void testViewPost_success() {
        BlogPost post = new BlogPost("View Test", "Content");
        post.setId(1L);
        post.setViewCount(5);

        when(mockedBlogPostService.getPostByIdWithViewCount(1L)).thenReturn(post);

        HttpResponse<BlogPost> response = client.toBlocking().exchange(
                HttpRequest.GET("/api/posts/1/view"), BlogPost.class);

        assertEquals(HttpStatus.OK, response.getStatus());
        assertNotNull(response.getBody().orElse(null));
        assertEquals(1L, response.getBody().get().getId());
        verify(mockedBlogPostService, times(1)).getPostByIdWithViewCount(1L);
    }

    @Test
    void testTogglePublishStatus_success() {
        BlogPost post = new BlogPost("Toggle Test", "Content");
        post.setId(1L);
        post.setPublished(true);

        when(mockedBlogPostService.togglePublishStatus(1L)).thenReturn(post);

        // FIX: PUT requests need a body parameter (even if null)
        HttpResponse<BlogPost> response = client.toBlocking().exchange(
                HttpRequest.PUT("/api/posts/1/publish", null), BlogPost.class);

        assertEquals(HttpStatus.OK, response.getStatus());
        assertNotNull(response.getBody().orElse(null));
        assertEquals(1L, response.getBody().get().getId());
        verify(mockedBlogPostService, times(1)).togglePublishStatus(1L);
    }


    @Test
    void testGetTotalPostsCount_success() {
        when(mockedBlogPostService.getTotalPostsCount()).thenReturn(10L);

        HttpResponse<Long> response = client.toBlocking().exchange(
                HttpRequest.GET("/api/posts/analytics/total"), Long.class);

        assertEquals(HttpStatus.OK, response.getStatus());
        assertNotNull(response.getBody().orElse(null));
        assertEquals(10L, response.getBody().get());
        verify(mockedBlogPostService, times(1)).getTotalPostsCount();
    }

    @Test
    void testGetPublishedPostsCount_success() {
        when(mockedBlogPostService.getPublishedPostsCount()).thenReturn(7L);

        HttpResponse<Long> response = client.toBlocking().exchange(
                HttpRequest.GET("/api/posts/analytics/published"), Long.class);

        assertEquals(HttpStatus.OK, response.getStatus());
        assertNotNull(response.getBody().orElse(null));
        assertEquals(7L, response.getBody().get());
        verify(mockedBlogPostService, times(1)).getPublishedPostsCount();
    }
}
