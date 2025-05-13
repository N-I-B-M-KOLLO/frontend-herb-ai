import apiClient from './apiClient';
import { documentApi } from './documentApi';
import { imageApi } from './ImageApi';
import { authService } from './authService';

// Re-export existing auth service
export { authService } from './authService';

// Export all API services
export {
  apiClient,
  documentApi,
  imageApi
};

// Export as default for convenient importing
export default {
  apiClient,
  documentApi,
  imageApi,
  authService
};