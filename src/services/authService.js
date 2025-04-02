// src/services/authService.js
import axios from 'axios';

// API URL from environment or default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

// Create an axios instance with authorization header
const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User data for registration
   * @returns {Promise<Object>} - Registration response
   */
  async register(userData) {
    try {
      const response = await authAxios.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  /**
   * Login a user
   * @param {Object} credentials - User login credentials
   * @returns {Promise<Object>} - Login response with token and user data
   */
  async login(credentials) {
    try {
      const response = await authAxios.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  /**
   * Get the current user session
   * @returns {Promise<Object>} - User session data
   */
  async getSession() {
    try {
      const response = await authAxios.get('/auth/session');
      return response.data.user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user session');
    }
  },

  /**
   * Logout the current user
   * @returns {Promise<Object>} - Logout response
   */
  async logout() {
    try {
      const response = await authAxios.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  },
};

export default authService;