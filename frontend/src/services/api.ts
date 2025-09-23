// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8888/api';

// Configure axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Blog Post Interface
export interface BlogPost {
  id?: number;
  title: string;
  content: string;
  summary?: string;
  author?: string;
  tags?: string;
  createdAt?: string;
  updatedAt?: string;
  published: boolean;
  viewCount?: number;
}

// API Functions
export const blogAPI = {
  // Get all posts
  getAllPosts: async (): Promise<BlogPost[]> => {
    const response = await api.get('/posts');
    return response.data;
  },

  // Get published posts only
  getPublishedPosts: async (): Promise<BlogPost[]> => {
    const response = await api.get('/posts/published');
    return response.data;
  },

  // Get post by ID (with view count increment)
  getPostById: async (id: number): Promise<BlogPost> => {
    const response = await api.get(`/posts/${id}/view`);
    return response.data;
  },

  // Create new post
  createPost: async (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>): Promise<BlogPost> => {
    const response = await api.post('/posts', post);
    return response.data;
  },

  // Update post
  updatePost: async (id: number, post: Partial<BlogPost>): Promise<BlogPost> => {
    const response = await api.put(`/posts/${id}`, post);
    return response.data;
  },

  // Delete post
  deletePost: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },

  // Search posts by title
  searchByTitle: async (query: string): Promise<BlogPost[]> => {
    const response = await api.get(`/posts/search/title?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Search posts by content
  searchByContent: async (query: string): Promise<BlogPost[]> => {
    const response = await api.get(`/posts/search/content?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Search posts by tags
  searchByTags: async (query: string): Promise<BlogPost[]> => {
    const response = await api.get(`/posts/search/tags?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get analytics
  getTotalPostsCount: async (): Promise<number> => {
    const response = await api.get('/posts/analytics/total');
    return response.data;
  },

  getPublishedPostsCount: async (): Promise<number> => {
    const response = await api.get('/posts/analytics/published');
    return response.data;
  },
};

export default api;
