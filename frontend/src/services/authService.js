import api from './api';
import toast from 'react-hot-toast';

export const authService = {
  // Login user
  async login(credentials) {
    try {
      const formData = new FormData();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token);
      
      // Get user profile
      const userResponse = await api.get('/auth/me');
      const user = userResponse.data;
      localStorage.setItem('user', JSON.stringify(user));

      toast.success(`Welcome back, ${user.username}!`);
      return { token: access_token, user };
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed';
      toast.error(message);
      throw error;
    }
  },

  // Register user
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      toast.success('Registration successful! Please login.');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed';
      toast.error(message);
      throw error;
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  },

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }
};