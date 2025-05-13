import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

// Create an axios instance with default config
const baseURL = process.env.NEXT_PUBLIC_API_URL_DOCUMENTS || 'http://localhost:8001';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
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
    
    // Log the error for debugging
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;