'use client';

import { ComponentType, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '~/hooks/useAuth';
import Loader from '~/ui/common/loader/Loader';

interface WithAuthOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  fallback?: ComponentType;
}

export function withAuth<P extends object>(
  Component: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const {
    redirectTo = '/auth',
    requireAuth = true,
    fallback: FallbackComponent,
  } = options;

  const AuthenticatedComponent = (props: P) => {
    const { isAuthenticated, loading, error } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && requireAuth && !isAuthenticated) {
        router.push(redirectTo);
      }
    }, [isAuthenticated, loading, router]);

    if (loading) {
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader color="purple" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Authentication Error</h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => router.push(redirectTo)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }

    if (requireAuth && !isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;

  return AuthenticatedComponent;
}

export default withAuth;