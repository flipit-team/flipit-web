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

      // Only redirect on 401 Unauthorized (invalid/expired token)
      // 403 Forbidden is a permissions issue, not an auth issue
      if (response.status === 401) {
        if (!isRedirecting && !window.location.pathname.includes('/login')) {
          isRedirecting = true;

          // Call server-side logout to clear httpOnly cookies (document.cookie cannot touch them)
          fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).finally(() => {
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
