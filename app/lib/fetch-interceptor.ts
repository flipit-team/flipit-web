// Global fetch interceptor to handle 401 errors and auto-logout

let isRedirecting = false;

export function setupFetchInterceptor() {
  if (typeof window === 'undefined') return; // Only run on client-side

  const originalFetch = window.fetch;

  window.fetch = async function (...args) {
    try {
      const response = await originalFetch(...args);

      // If we get a 401 Unauthorized or 403 Forbidden, automatically logout and redirect
      if (response.status === 401 || response.status === 403) {
        // Prevent multiple redirects
        if (!isRedirecting) {
          isRedirecting = true;

          console.warn('Token expired or invalid. Logging out...');

          // Clear cookies
          document.cookie.split(";").forEach((c) => {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
          });

          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = '/login';
            isRedirecting = false;
          }, 100);
        }
      }

      return response;
    } catch (error) {
      throw error;
    }
  };
}

// Call this in your app initialization
if (typeof window !== 'undefined') {
  setupFetchInterceptor();
}
