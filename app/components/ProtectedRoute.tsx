'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '~/hooks/useAuth';
import Loader from '~/ui/common/loader/Loader';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export function ProtectedRoute({ 
  children, 
  fallback, 
  redirectTo = '/auth', 
  requireAuth = true 
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we actually need auth and definitely not authenticated
    if (!loading && requireAuth && isAuthenticated === false) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, requireAuth, redirectTo, router]);

  if (loading) {
    return fallback || (
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
    return fallback || null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;