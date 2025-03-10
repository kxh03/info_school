
import axios from 'axios';

// Create axios instance with base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle unauthorized responses
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('authToken');
      // Don't redirect automatically here, let the auth context handle it
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: any) => api.post('/users/register', userData),
  login: (credentials: any) => api.post('/users/login', credentials),
  getCurrentUser: () => api.get('/users/profile'),
  getUserById: (id: string) => api.get(`/users/${id}`),
  // Changed to use individual user fetches instead of batch
  getUsers: () => api.get('/users'),
};

// Clubs API
export const clubsAPI = {
  getAllClubs: () => api.get('/clubs'),
  getClubById: (id: string) => api.get(`/clubs/${id}`),
  createClub: (clubData: any) => api.post('/clubs', clubData),
  updateClub: (id: string, clubData: any) => api.put(`/clubs/${id}`, clubData),
  joinClub: (id: string) => api.post(`/clubs/${id}/join`),
  leaveClub: (id: string) => api.post(`/clubs/${id}/leave`)
};

// Posts API
export const postsAPI = {
  getAllPosts: () => api.get('/posts'),
  getPostById: (id: string) => api.get(`/posts/${id}`),
  createPost: (postData: any) => api.post('/posts', postData),
  updatePost: (id: string, postData: any) => api.put(`/posts/${id}`, postData),
  deletePost: (id: string) => api.delete(`/posts/${id}`),
  likePost: (id: string) => api.post(`/posts/${id}/like`),
  unlikePost: (id: string) => api.post(`/posts/${id}/unlike`),
  getCommentsByPostId: (id: string) => api.get(`/posts/${id}/comments`),
  // Corrected endpoints for user posts (using the /posts?author=userId format instead)
  getUserPosts: (userId: string) => api.get(`/posts?author=${userId}`),
};

// Comments API
export const commentsAPI = {
  createComment: (commentData: any) => api.post('/posts/comment', commentData),
  deleteComment: (id: string) => api.delete(`/posts/comment/${id}`)
};

export default api;