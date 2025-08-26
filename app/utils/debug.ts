export function debugLog(context: string, data: any) {
  if (process.env.NODE_ENV === 'development') {
  }
}

export function debugError(context: string, error: any) {
  if (error?.stack) {
  }
}

export function debugApiResponse(endpoint: string, response: any) {
  if (process.env.NODE_ENV === 'development') {
  }
}