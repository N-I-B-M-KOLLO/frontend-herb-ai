import apiClient from './apiClient';

export interface ImageResponse {
  filename: string;
  image_url: string;
  image_data: string; // base64 encoded image
}

export interface ImageRequest {
  prompt: string;
}

/**
 * Image API service
 */
export const imageApi = {
  /**
   * Generate an image based on prompt
   * @param prompt - The prompt to generate image from
   * @returns Response from the API containing image data
   */
  generateImage: async (prompt: string) => {
    try {
      console.log("Sending image generation request for prompt:", prompt);
      
      const requestData: ImageRequest = {
        prompt: prompt
      };
      
      const response = await apiClient.post<ImageResponse>('/generate-image/', requestData);
      
      // Log the successful response for debugging
      console.log("Image generation successful");
      console.log("Image URL:", response.data.image_url);
      console.log("Image data length:", response.data.image_data?.length || 0);
      
      // Ensure image_url is properly formed (may already be handled by apiClient)
      if (response.data.image_url && !response.data.image_url.startsWith('http')) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
        console.log(`Resolving relative URL: ${response.data.image_url} with base: ${baseUrl}`);
      }
      
      return response.data;
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  },
  
  /**
   * Get an image by filename
   * @param filename - The image filename
   * @returns Full URL to the image
   */
  getImageUrl: (filename: string): string => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
    return `${baseUrl}/images/${filename}`;
  },
  
  /**
   * Convert a relative image URL to an absolute URL
   * @param imageUrl - The relative or absolute image URL
   * @returns Absolute URL to the image
   */
  resolveImageUrl: (imageUrl: string | undefined): string => {
    if (!imageUrl) return '';
    
    // If already absolute URL, return as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Otherwise, prepend the API base URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
    
    // Handle URLs that already have a leading slash
    const normalizedPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${baseUrl}${normalizedPath}`;
  }
};

export default imageApi;