/**
 * Utility functions for authentication checks
 */

/**
 * Check if user has a token in cookies (client-side only)
 * @returns boolean - true if token exists, false otherwise
 */
export function hasAuthToken(): boolean {
  if (typeof window === 'undefined') {
    return false; // Server-side, can't check cookies
  }
  
  return document.cookie.includes('token=') && 
         document.cookie.split(';').some(cookie => {
           const [name, value] = cookie.trim().split('=');
           return name === 'token' && value && value !== '';
         });
}

/**
 * Check if we're on a public page that doesn't need auth
 * @param pathname - current page path
 * @returns boolean - true if it's a public page
 */
export function isPublicPage(pathname: string): boolean {
  const publicPages = [
    '/', // login page
    '/auth',
    '/register', 
    '/login',
    '/forgot-password',
    '/reset-password',
    '/verify',
    '/home', // public home page
    '/live-auction', // public auction viewing
    '/faq'
  ];
  
  return publicPages.some(page => pathname.startsWith(page));
}

/**
 * Check if we're on a protected page that requires auth
 * @param pathname - current page path  
 * @returns boolean - true if it's a protected page
 */
export function isProtectedPage(pathname: string): boolean {
  const protectedPages = [
    '/post-an-item',
    '/my-items',
    '/current-bids', 
    '/saved-items',
    '/settings',
    '/notifications',
    '/messages',
    '/profile'
  ];
  
  return protectedPages.some(page => pathname.startsWith(page));
}