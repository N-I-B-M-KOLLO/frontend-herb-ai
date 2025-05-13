import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (expired tokens)
    if (error.response && error.response.status === 401) {
      // Clear auth state
      useAuthStore.getState().logout();
     
      // Redirect to login if we're in a browser environment
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
   
    const response = await axios.post(`${baseURL}/token`, formData);
    return response.data;
  },
 
  register: async (userData: { username: string; password: string; plan: string }) => {
    // Updated to include user_plan in the request payload
    const response = await api.post('/users/', {
      username: userData.username,
      password: userData.password,
      user_plan: userData.plan
    });
    return response.data;
  },
 
  getCurrentUser: async () => {
    const response = await api.get('/users/me/');
    return response.data;
  },

  getAllUsers: async () => {
  const response = await api.get('/admin/users/');
  return response.data;
},
 
  getAdminDashboard: async () => {
    const response = await api.get('/admin/dashboard/');
    return response.data;
  },
 
  getRegularDashboard: async () => {
    const response = await api.get('/regular/dashboard/');
    return response.data;
  },
 
  updateUserPlan: async (plan: string) => {
    const response = await api.patch('/users/me/update-plan', { user_plan: plan });
    return response.data;
  },
  
  updatePassword: async (passwords: { current_password: string; new_password: string }) => {
    const response = await api.patch('/users/me/update-password', passwords);
    return response.data;
  },
 
  // Verify token is still valid
  verifyToken: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return false;
   
    try {
      await api.get('/users/me/');
      return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      useAuthStore.getState().logout();
      return false;
    }
  },
};