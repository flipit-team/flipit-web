import { apiClient, handleApiCall } from '~/lib/api-client';
import { PresignUploadUrlResponse, PresignDownloadUrlResponse, UploadFileResponse } from '~/types/api';

export class FilesService {
  // Get presigned upload URL
  static async getPresignUploadUrl(key: string) {
    return handleApiCall(() =>
      apiClient.get<PresignUploadUrlResponse>(`/files/presign-upload-url?key=${encodeURIComponent(key)}`, { requireAuth: true })
    );
  }

  // Get presigned download URL
  static async getPresignDownloadUrl(key: string) {
    return handleApiCall(() =>
      apiClient.get<PresignDownloadUrlResponse>(`/files/presign-download-url?key=${encodeURIComponent(key)}`, { requireAuth: true })
    );
  }

  // Upload file directly
  static async uploadFile(file: File, oldKey?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (oldKey) {
      formData.append('oldKey', oldKey);
    }

    return handleApiCall(() =>
      apiClient.postFormData<UploadFileResponse>('/upload', formData, { requireAuth: true })
    );
  }

  // Upload multiple files
  static async uploadFiles(files: File[]) {
    const uploadPromises = files.map(file => this.uploadFile(file));
    
    try {
      const results = await Promise.allSettled(uploadPromises);
      
      const successful: UploadFileResponse[] = [];
      const failed: Error[] = [];
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.data) {
          successful.push(result.value.data);
        } else if (result.status === 'rejected') {
          failed.push(new Error(`Failed to upload file ${files[index].name}: ${result.reason}`));
        } else if (result.value.error) {
          failed.push(result.value.error);
        }
      });
      
      return { data: { successful, failed }, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error('Unknown error occurred during file upload')
      };
    }
  }

  // Delete file (if endpoint exists)
  static async deleteFile(key: string) {
    return handleApiCall(() =>
      apiClient.delete<{ message: string }>(`/files/${encodeURIComponent(key)}`, { requireAuth: true })
    );
  }

  // Generate unique file key
  static generateFileKey(fileName: string, prefix?: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = fileName.split('.').pop();
    const baseName = fileName.split('.').slice(0, -1).join('.');
    const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, '_');
    
    const key = prefix 
      ? `${prefix}/${timestamp}_${randomString}_${sanitizedBaseName}.${extension}`
      : `${timestamp}_${randomString}_${sanitizedBaseName}.${extension}`;
    
    return key;
  }

  // Validate file
  static validateFile(file: File, options?: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    allowedExtensions?: string[];
  }): { isValid: boolean; error?: string } {
    const { maxSize = 10 * 1024 * 1024, allowedTypes, allowedExtensions } = options || {}; // Default 10MB

    // Check file size
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`
      };
    }

    // Check file type
    if (allowedTypes && !allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not allowed`
      };
    }

    // Check file extension
    if (allowedExtensions) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !allowedExtensions.includes(extension)) {
        return {
          isValid: false,
          error: `File extension .${extension} is not allowed`
        };
      }
    }

    return { isValid: true };
  }
}

export default FilesService;