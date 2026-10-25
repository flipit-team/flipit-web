// Global fetch interceptor to handle 401 errors and auto-logout

let isSetup = false;
let isRedirecting = false;

export function setupFetchInterceptor() {
  if (typeof window === 'undefined') return;
  if (isSetup) return; // Prevent double-wrapping
  isSetup = true;

  const originalFetch = window.fetch;

  window.fetch = async function (...args) {
    try {
      const response = await originalFetch(...args);

      // Only redirect on 401 from auth-related endpoints (expired/invalid token).
      // Non-auth endpoints (payments, shipping, etc.) may return 401 for business
      // reasons (e.g. "account not verified") — those should NOT trigger logout.
      if (response.status === 401) {
        const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url || '';
        const isAuthEndpoint = url.includes('/api/auth/') || url.includes('/api/profile/') || url.includes('/api/user/');
        const isApiRoute = url.startsWith('/api/');

        if (isAuthEndpoint && !isRedirecting && !window.location.pathname.includes('/login')) {
          isRedirecting = true;
          originalFetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).finally(() => {
            isRedirecting = false;
            window.location.href = '/login';
          });
        }
      }

      return response;
    } catch (error) {
      throw error;
    }
  };
}
