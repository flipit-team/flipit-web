'use client';

import React from 'react';
import Image from 'next/image';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  className?: string;
  fullScreen?: boolean;
}

export function ErrorDisplay({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  showRetry = true,
  className = '',
  fullScreen = false,
}: ErrorDisplayProps) {
  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50'
    : `flex flex-col items-center justify-center py-8 ${className}`;

  return (
    <div className={containerClasses}>
      <div className="text-center max-w-md mx-auto">
        <div className="mb-4">
          <Image
            src="/error-icon.svg"
            alt="Error"
            width={48}
            height={48}
            className="mx-auto"
          />
        </div>
        
        <h3 className="text-lg font-semibold text-red-600 mb-2 typo-heading_ss">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6 typo-body_mr">
          {message}
        </p>
        
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors typo-body_ms"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorDisplay;