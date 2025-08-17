import { ApiClientError } from '~/lib/api-client';

export interface ErrorInfo {
  title: string;
  message: string;
  actionText?: string;
  actionHandler?: () => void;
}

export function handleApiError(error: Error | ApiClientError): ErrorInfo {
  // Handle API client errors with specific status codes
  if (error instanceof ApiClientError) {
    switch (error.status) {
      case 401:
        return {
          title: 'Authentication Required',
          message: 'Please log in to continue.',
          actionText: 'Go to Login',
          actionHandler: () => window.location.href = '/auth',
        };
      
      case 403:
        return {
          title: 'Access Denied',
          message: 'You don\'t have permission to access this resource.',
        };
      
      case 404:
        return {
          title: 'Not Found',
          message: 'The requested resource could not be found.',
        };
      
      case 429:
        return {
          title: 'Too Many Requests',
          message: 'Please wait a moment before trying again.',
        };
      
      case 500:
        return {
          title: 'Server Error',
          message: 'Our servers are experiencing issues. Please try again later.',
        };
      
      case 503:
        return {
          title: 'Service Unavailable',
          message: 'The service is temporarily unavailable. Please try again later.',
        };
      
      default:
        return {
          title: 'Request Failed',
          message: error.data?.message || error.message || 'The request could not be completed.',
        };
    }
  }
  
  // Handle network errors
  if (error.message.includes('Network error') || error.message.includes('fetch')) {
    return {
      title: 'Connection Error',
      message: 'Please check your internet connection and try again.',
    };
  }
  
  // Handle timeout errors
  if (error.message.includes('timeout')) {
    return {
      title: 'Request Timeout',
      message: 'The request took too long to complete. Please try again.',
    };
  }
  
  // Default error handling
  return {
    title: 'Something went wrong',
    message: error.message || 'An unexpected error occurred.',
  };
}

export function createRetryHandler(originalFunction: () => Promise<any>, maxRetries = 3) {
  let retryCount = 0;
  
  const retry = async (): Promise<any> => {
    try {
      return await originalFunction();
    } catch (error) {
      retryCount++;
      
      if (retryCount <= maxRetries) {
        // Exponential backoff: wait 1s, 2s, 4s...
        const delay = Math.pow(2, retryCount - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return retry();
      }
      
      throw error;
    }
  };
  
  return retry;
}

export function isRetryableError(error: Error | ApiClientError): boolean {
  if (error instanceof ApiClientError) {
    // Retry for server errors, timeouts, and rate limits
    return [408, 429, 500, 502, 503, 504].includes(error.status);
  }
  
  // Retry for network and timeout errors
  return error.message.includes('Network error') || 
         error.message.includes('timeout') ||
         error.message.includes('fetch');
}

export function getErrorSeverity(error: Error | ApiClientError): 'low' | 'medium' | 'high' | 'critical' {
  if (error instanceof ApiClientError) {
    if (error.status >= 500) return 'critical';
    if (error.status === 401 || error.status === 403) return 'high';
    if (error.status === 404 || error.status === 429) return 'medium';
    return 'low';
  }
  
  if (error.message.includes('Network error')) return 'high';
  if (error.message.includes('timeout')) return 'medium';
  
  return 'low';
}

// Error reporting utility (for future analytics/monitoring)
export function reportError(error: Error | ApiClientError, context?: Record<string, any>) {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    severity: getErrorSeverity(error),
    context,
  };
  
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.group('🚨 Error Report');
    console.error('Error:', error);
    console.log('Context:', context);
    console.log('Severity:', errorInfo.severity);
    console.groupEnd();
  }
  
  // TODO: In production, send to error reporting service
  // Example: Sentry, LogRocket, Bugsnag, etc.
}