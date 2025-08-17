export function debugLog(context: string, data: any) {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🐛 DEBUG: ${context}`);
    console.log(data);
    console.groupEnd();
  }
}

export function debugError(context: string, error: any) {
  console.group(`🚨 ERROR: ${context}`);
  console.error(error);
  if (error?.stack) {
    console.error('Stack:', error.stack);
  }
  console.groupEnd();
}

export function debugApiResponse(endpoint: string, response: any) {
  if (process.env.NODE_ENV === 'development') {
    console.group(`📡 API Response: ${endpoint}`);
    console.log('Response:', response);
    console.groupEnd();
  }
}