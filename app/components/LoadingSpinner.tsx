'use client';

import React from 'react';
import Loader from '~/ui/common/loader/Loader';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'purple' | 'white' | 'ash' | 'green';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingSpinner({
  size = 'medium',
  color = 'purple',
  text,
  fullScreen = false,
  className = '',
}: LoadingSpinnerProps) {
  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50'
    : `flex flex-col items-center justify-center ${className}`;

  const sizeClasses = {
    small: 'py-4',
    medium: 'py-8',
    large: 'py-12',
  };

  return (
    <div className={`${containerClasses} ${sizeClasses[size]}`}>
      <Loader color={color} />
      {text && (
        <p className="mt-4 text-gray-600 typo-body_mr text-center">
          {text}
        </p>
      )}
    </div>
  );
}

export default LoadingSpinner;