'use client';

import React, { ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';

interface ApiStateHandlerProps {
  loading: boolean;
  error: string | null;
  children: ReactNode;
  loadingText?: string;
  errorTitle?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  fullScreen?: boolean;
  className?: string;
}

export function ApiStateHandler({
  loading,
  error,
  children,
  loadingText,
  errorTitle,
  onRetry,
  showRetry = true,
  loadingComponent,
  errorComponent,
  fullScreen = false,
  className = '',
}: ApiStateHandlerProps) {
  if (loading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }
    
    return (
      <LoadingSpinner
        text={loadingText}
        fullScreen={fullScreen}
        className={className}
      />
    );
  }

  if (error) {
    if (errorComponent) {
      return <>{errorComponent}</>;
    }
    
    return (
      <ErrorDisplay
        title={errorTitle}
        message={error}
        onRetry={onRetry}
        showRetry={showRetry}
        fullScreen={fullScreen}
        className={className}
      />
    );
  }

  return <>{children}</>;
}

export default ApiStateHandler;