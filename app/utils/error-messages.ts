// Centralized error message mapping for user-friendly error handling

export interface UserFriendlyError {
  title: string;
  message: string;
  action?: string;
}

// Map technical error messages to user-friendly ones
export const errorMessageMap: Record<string, UserFriendlyError> = {
  // Authentication errors
  'Email and/or password is incorrect': {
    title: 'Login Failed',
    message: 'The email or password you entered is incorrect. Please check and try again.',
    action: 'Verify your credentials or reset your password if needed.'
  },
  'Invalid credentials': {
    title: 'Login Failed',
    message: 'The email or password you entered is incorrect. Please check and try again.',
    action: 'Verify your credentials or reset your password if needed.'
  },
  'Unauthorized': {
    title: 'Login Failed',
    message: 'The email or password you entered is incorrect. Please check and try again.',
    action: 'Verify your credentials or reset your password if needed.'
  },
  'No token received from server': {
    title: 'Login Issue',
    message: 'We encountered a problem signing you in. Please try again.',
    action: 'If the problem persists, please contact support.'
  },
  'Authentication required': {
    title: 'Please Sign In',
    message: 'You need to be signed in to access this feature.',
    action: 'Please sign in to your account and try again.'
  },
  'Token verification failed': {
    title: 'Session Expired',
    message: 'Your session has expired. Please sign in again.',
    action: 'Sign in to continue using the application.'
  },

  // Form validation errors
  'Invalid user data received': {
    title: 'Registration Error',
    message: 'There was an issue with the information provided. Please check your details.',
    action: 'Ensure all required fields are filled correctly.'
  },
  'Cannot invoke "String.trim()"': {
    title: 'Missing Required Information',
    message: 'Some required information is missing or invalid.',
    action: 'Please fill in all required fields and try again.'
  },
  'getPhoneNumber()" is null': {
    title: 'Phone Number Required',
    message: 'Please enter your phone number.',
    action: 'Phone number is required for registration.'
  },
  'Phone number is required': {
    title: 'Phone Number Required',
    message: 'Please enter your phone number to complete registration.',
    action: 'Phone number is required for account verification.'
  },
  'Username already exists': {
    title: 'Username Taken',
    message: 'This username is already in use. Please choose a different one.',
    action: 'Try a different username or sign in if you already have an account.'
  },
  'Email already exists': {
    title: 'Email Already Registered',
    message: 'An account with this email already exists.',
    action: 'Try signing in instead or use a different email address.'
  },

  // File Upload errors
  'Maximum upload size exceeded': {
    title: 'File Too Large',
    message: 'The file you are trying to upload exceeds the maximum allowed size.',
    action: 'Please select a smaller file and try again.'
  },

  // Item/Auction errors
  'Error writing JSON output': {
    title: 'Unable to Save Item',
    message: 'We encountered a problem saving your item. This is usually temporary.',
    action: 'Please try again in a few moments. If the problem persists, contact support.'
  },
  'could not initialize proxy - no Session': {
    title: 'Session Problem',
    message: 'We encountered a technical issue with your session.',
    action: 'Please try signing in again or refresh the page.'
  },
  'failed to lazily initialize a collection': {
    title: 'Data Loading Issue',
    message: 'We had trouble loading some data for your request.',
    action: 'Please try again or refresh the page.'
  },
  'Could not write JSON': {
    title: 'Save Failed',
    message: 'Your item could not be saved due to a technical issue.',
    action: 'Please try again or contact support if the problem continues.'
  },
  'No Session': {
    title: 'Session Error',
    message: 'Your session has expired or is invalid.',
    action: 'Please sign in again to continue.'
  },
  'Item not found': {
    title: 'Item Not Found',
    message: 'The item you are looking for could not be found.',
    action: 'It may have been removed or you may not have permission to view it.'
  },
  'Insufficient permissions': {
    title: 'Access Denied',
    message: 'You do not have permission to perform this action.',
    action: 'Contact the item owner or an administrator if you believe this is an error.'
  },

  // Network/Server errors
  'Network Error': {
    title: 'Connection Problem',
    message: 'We could not connect to our servers.',
    action: 'Please check your internet connection and try again.'
  },
  'Internal server error': {
    title: 'Server Error',
    message: 'We encountered a technical problem on our end.',
    action: 'Please try again in a few moments. If the issue persists, contact support.'
  },
  'Service unavailable': {
    title: 'Service Temporarily Unavailable',
    message: 'Our service is temporarily unavailable.',
    action: 'Please try again in a few minutes.'
  },
  'Request timeout': {
    title: 'Request Timed Out',
    message: 'Your request took too long to process.',
    action: 'Please try again with a stable internet connection.'
  },

  // File upload errors
  'File too large': {
    title: 'File Too Large',
    message: 'The file you are trying to upload is too large.',
    action: 'Please choose a smaller file (maximum 5MB) and try again.'
  },
  'Invalid file type': {
    title: 'Invalid File Type',
    message: 'The file type you are trying to upload is not supported.',
    action: 'Please upload a JPG, PNG, or GIF image file.'
  },
  'Upload failed': {
    title: 'Upload Failed',
    message: 'Your file could not be uploaded.',
    action: 'Please check your internet connection and try again.'
  },

  // Bidding/Auction errors
  'Auction has ended': {
    title: 'Auction Ended',
    message: 'This auction has already ended.',
    action: 'You can no longer place bids on this item.'
  },
  'Bid too low': {
    title: 'Bid Too Low',
    message: 'Your bid must be higher than the current highest bid.',
    action: 'Please enter a higher amount and try again.'
  },
  'Cannot bid on own item': {
    title: 'Cannot Bid',
    message: 'You cannot bid on your own item.',
    action: 'You can edit or remove your listing instead.'
  },

  // Generic messages
  'An error occurred': {
    title: 'Something Went Wrong',
    message: 'We encountered an unexpected problem.',
    action: 'Please try again. If the problem continues, contact our support team.'
  },

  // Generic fallbacks
  'UNAUTHORIZED': {
    title: 'Access Denied',
    message: 'You are not authorized to perform this action.',
    action: 'Please sign in or contact support if you believe this is an error.'
  },
  'FORBIDDEN': {
    title: 'Action Not Allowed',
    message: 'You do not have permission to perform this action.',
    action: 'Contact an administrator if you believe this is an error.'
  },
  'NOT_FOUND': {
    title: 'Not Found',
    message: 'The requested item or page could not be found.',
    action: 'Please check the URL or try searching for what you need.'
  },
  'BAD_REQUEST': {
    title: 'Invalid Request',
    message: 'The information provided is invalid or incomplete.',
    action: 'Please check your input and try again.'
  },

  // HTTP Status Codes
  '400': {
    title: 'Invalid Request',
    message: 'The information provided is invalid or incomplete.',
    action: 'Please check your input and try again.'
  },
  '401': {
    title: 'Authentication Required',
    message: 'You need to be signed in to perform this action.',
    action: 'Please sign in and try again.'
  },
  '403': {
    title: 'Access Denied',
    message: 'You do not have permission to perform this action.',
    action: 'Contact support if you believe this is an error.'
  },
  '404': {
    title: 'Not Found',
    message: 'The requested item or page could not be found.',
    action: 'Please check the URL or try searching for what you need.'
  },
  '500': {
    title: 'Server Error',
    message: 'We encountered a technical problem on our servers.',
    action: 'Please try again in a few moments. Contact support if the problem persists.'
  },
  '502': {
    title: 'Service Unavailable',
    message: 'Our service is temporarily unavailable.',
    action: 'Please try again in a few minutes.'
  },
  '503': {
    title: 'Service Unavailable',
    message: 'Our service is temporarily unavailable for maintenance.',
    action: 'Please try again in a few minutes.'
  }
};

// Function to get user-friendly error message
export function getUserFriendlyError(error: any): UserFriendlyError {
  // If error is already a formatted friendly error, return it directly
  if (error?.error?.title && error?.error?.message) {
    return error.error;
  }

  // Handle different error formats
  let errorMessage = '';
  let errorStatus = '';

  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error?.message && typeof error.message === 'string' &&
             error.message !== 'Request failed with status 401' &&
             error.message !== 'Request failed with status 400' &&
             error.message !== 'Request failed with status 403' &&
             error.message !== 'Request failed with status 500') {
    // If error.message is already a user-friendly message, use it directly
    return {
      title: 'Error',
      message: error.message,
      action: undefined
    };
  } else if (error?.data?.message) {
    // ApiClientError has the API response data
    errorMessage = error.data.message;
    errorStatus = error.status;
  } else if (error?.data?.debugMessage) {
    // Handle debugMessage from API error
    errorMessage = error.data.debugMessage;
    errorStatus = error.status;
  } else if (error?.apierror?.message) {
    errorMessage = error.apierror.message;
    errorStatus = error.apierror.status;
  } else if (error?.apierror?.debugMessage) {
    errorMessage = error.apierror.debugMessage;
    errorStatus = error.apierror.status;
  } else if (error?.message) {
    errorMessage = error.message;
  } else if (error?.error?.message) {
    errorMessage = error.error.message;
  }

  // First try to match the exact error message
  const exactMatch = errorMessageMap[errorMessage];
  if (exactMatch) {
    return exactMatch;
  }

  // Try to match the status (both string and number forms)
  if (errorStatus) {
    const statusMatch = errorMessageMap[errorStatus] || errorMessageMap[String(errorStatus)];
    if (statusMatch) {
      return statusMatch;
    }
  }

  // Try to match HTTP status codes from response
  if (error?.status) {
    const statusMatch = errorMessageMap[String(error.status)];
    if (statusMatch) {
      return statusMatch;
    }
  }

  // Try to find partial matches for common error patterns
  for (const [key, value] of Object.entries(errorMessageMap)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(errorMessage.toLowerCase())) {
      return value;
    }
  }

  // Default fallback error
  return {
    title: 'Something Went Wrong',
    message: 'We encountered an unexpected error.',
    action: 'Please try again. If the problem continues, please contact our support team.'
  };
}

// Function to format error for display
export function formatErrorForDisplay(error: any): {
  title: string;
  message: string;
  action?: string;
  technical?: string; // For debugging in development
} {
  // Debug logging in development to understand error structure
  if (process.env.NODE_ENV === 'development') {
    console.log('Error received in formatErrorForDisplay:', {
      error,
      type: typeof error,
      data: error?.data,
      message: error?.message,
      status: error?.status
    });
  }

  const friendlyError = getUserFriendlyError(error);

  const result = {
    ...friendlyError,
    technical: undefined as string | undefined
  };

  // In development, include technical details
  if (process.env.NODE_ENV === 'development') {
    if (typeof error === 'string') {
      result.technical = error;
    } else if (error?.data?.debugMessage) {
      result.technical = error.data.debugMessage;
    } else if (error?.data?.message) {
      result.technical = error.data.message;
    } else if (error?.apierror?.debugMessage) {
      result.technical = error.apierror.debugMessage;
    } else if (error?.message) {
      result.technical = error.message;
    } else {
      result.technical = JSON.stringify(error, null, 2);
    }
  }

  return result;
}