import { ApiError, ApiResponse } from '~/types/api';

// Environment-based API configuration
const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    // Server-side
    return process.env.NODE_ENV === 'development'
      ? process.env.API_BASE_PATH || 'http://localhost:8080/api/v1'
      : process.env.API_BASE_PATH || 'https://api.flipit.ng/api/v1';
  } else {
    // Client-side - use Next.js API routes as proxy
    return '/api';
  }
};

export const API_BASE_URL = getApiBaseUrl();

// Custom error class for API errors
export class ApiClientError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data: any,
    message?: string
  ) {
    super(message || `API Error: ${status} ${statusText}`);
    this.name = 'ApiClientError';
  }
}

// Request configuration interface
interface RequestConfig extends RequestInit {
  requireAuth?: boolean;
  timeout?: number;
}

// API Client class
export class ApiClient {
  private baseURL: string;
  private defaultTimeout = 30000; // 30 seconds

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Get auth token from cookies (client-side) or headers (server-side)
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') {
      // Server-side - token should be passed via headers or cookies
      return null;
    } else {
      // Client-side - token is managed by Next.js API routes
      return null;
    }
  }

  // Create request headers
  private createHeaders(config?: RequestConfig): Headers {
    const headers = new Headers();
    
    headers.set('Content-Type', 'application/json');
    
    // Add auth token if required
    if (config?.requireAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  // Handle response and error processing
  private async handleResponse<T>(response: Response): Promise<T> {
    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const responseData = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      // Handle specific HTTP status codes
      if (response.status === 413) {
        throw new ApiClientError(
          response.status,
          response.statusText,
          responseData,
          'File size exceeds the maximum allowed limit'
        );
      }

      // Handle API errors
      if (isJson && responseData.apierror) {
        throw new ApiClientError(
          response.status,
          response.statusText,
          responseData.apierror,
          responseData.apierror.message || `Request failed with status ${response.status}`
        );
      } else {
        throw new ApiClientError(
          response.status,
          response.statusText,
          responseData,
          `Request failed with status ${response.status}`
        );
      }
    }

    return responseData;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { timeout = this.defaultTimeout, requireAuth = false, ...fetchConfig } = config;
    
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    const headers = this.createHeaders(config);

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof ApiClientError) {
        throw error;
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${timeout}ms`);
        }
        throw new Error(`Network error: ${error.message}`);
      }
      
      throw new Error('Unknown error occurred');
    }
  }

  // HTTP method helpers
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  // Form data request (for file uploads)
  async postFormData<T>(endpoint: string, formData: FormData, config?: RequestConfig): Promise<T> {
    const { timeout = this.defaultTimeout, requireAuth = false, ...fetchConfig } = config || {};
    
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    const headers = new Headers();
    
    // Don't set Content-Type for FormData - let browser set it with boundary
    if (requireAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        method: 'POST',
        headers,
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof ApiClientError) {
        throw error;
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${timeout}ms`);
        }
        throw new Error(`Network error: ${error.message}`);
      }
      
      throw new Error('Unknown error occurred');
    }
  }
}

// Create default API client instance
export const apiClient = new ApiClient();

// Utility function to handle API responses with error handling
export async function handleApiCall<T>(
  apiCall: () => Promise<T>
): Promise<{ data: T; error: null } | { data: null; error: ApiClientError | Error }> {
  try {
    const data = await apiCall();
    return { data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    };
  }
}

// Helper function to build query string from object
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}