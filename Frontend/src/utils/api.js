// utils/api.js
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:3306/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions for posts
export const postAPI = {
  // Get all posts with optional filters
  getAllPosts: (params = {}) => {
    return api.get('/posts', { params });
  },

  // Get single post by ID
  getPostById: (id) => {
    return api.get(`/posts/${id}`);
  },

  // Create new post
  createPost: (postData) => {
    return api.post('/posts', postData);
  },

  // Update post
  updatePost: (id, postData) => {
    return api.put(`/posts/${id}`, postData);
  },

  // Delete post
  deletePost: (id) => {
    return api.delete(`/posts/${id}`);
  },

  // Get user's own posts
  getUserPosts: (params = {}) => {
    return api.get('/my-posts', { params });
  },

  // Get categories
  getCategories: () => {
    return api.get('/categories');
  },
};

// Auth API functions
export const authAPI = {
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },

  register: (userData) => {
    return api.post('/auth/register', userData);
  },

  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default api;