import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
   
    const response = await axios.post(`${baseURL}/token`, formData);
    return response.data;
  },
 
  register: async (userData: { username: string; password: string }) => {
    const response = await api.post('/users/', userData);
    return response.data;
  },
 
  getCurrentUser: async () => {
    const response = await api.get('/users/me/');
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
};