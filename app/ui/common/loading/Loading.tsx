import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
  className?: string;
  center?: boolean;
}

const sizeClasses = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6', 
  md: 'w-8 h-8',
  lg: 'w-12 h-12'
};

const textSizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg'
};

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text,
  variant = 'spinner',
  className = '',
  center = true
}) => {
  const containerClasses = center ? 'flex flex-col items-center justify-center' : '';

  if (variant === 'spinner') {
    return (
      <div className={`${containerClasses} ${className}`}>
        <Loader className={`${sizeClasses[size]} animate-spin text-primary`} />
        {text && (
          <p className={`${textSizeClasses[size]} text-text_four mt-2`}>{text}</p>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`${containerClasses} ${className}`}>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        {text && (
          <p className={`${textSizeClasses[size]} text-text_four mt-2`}>{text}</p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`${containerClasses} ${className}`}>
        <div className={`${sizeClasses[size]} bg-gray-300 rounded-full animate-pulse`}></div>
        {text && (
          <p className={`${textSizeClasses[size]} text-text_four mt-2 animate-pulse`}>{text}</p>
        )}
      </div>
    );
  }

  return null;
};

export default Loading;