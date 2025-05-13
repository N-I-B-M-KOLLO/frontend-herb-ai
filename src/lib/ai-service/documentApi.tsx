import apiClient from './apiClient';

export interface Document {
  id: number;
  title: string;
  description?: string;
  filename: string;
  original_filename: string;
  content_type: string;
  file_path: string;
  content?: string;
  uploaded_at: string;
}

export interface QueryResponse {
  response: string;
}

export interface QueryRequest {
  query: string;
  document_id?: number;
}

/**
 * Document API service
 */
export const documentApi = {
  /**
   * Upload a document
   * @param file - The file to upload
   * @param title - Document title
   * @param description - Document description (optional)
   * @returns Response from the API
   */
  uploadDocument: async (file: File, title: string, description: string = '') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
   
    if (description) {
      formData.append('description', description);
    }
   
    return apiClient.post<Document>('/upload-document/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
 
  /**
   * Get all documents
   * @returns Response from the API
   */
  getDocuments: async () => {
    return apiClient.get<Document[]>('/documents/');
  },
 
  /**
   * Get a specific document by ID
   * @param documentId - The document ID
   * @returns Response from the API
   */
  getDocument: async (documentId: number) => {
    return apiClient.get<Document>(`/documents/${documentId}`);
  },
 
  /**
   * Delete a document by ID
   * @param documentId - The document ID to delete
   * @returns Response from the API
   */
  deleteDocument: async (documentId: number) => {
    return apiClient.delete(`/documents/${documentId}`);
  },
  
  /**
   * Query document(s)
   * @param query - The query text
   * @param documentId - Optional document ID (if not provided, queries all docs)
   * @returns Response from the API
   */
  queryDocument: async (query: string, documentId?: number) => {
    const requestData: QueryRequest = {
      query: query
    };
   
    if (documentId) {
      requestData.document_id = documentId;
    }
   
    console.log('Sending query to:', '/query/');
    console.log('Request data:', requestData);
    
    // Make sure URL matches exactly what Postman uses successfully
    return apiClient.post<QueryResponse>('/query/', requestData);
  }
};

export default documentApi;