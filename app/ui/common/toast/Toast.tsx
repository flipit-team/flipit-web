'use client';
import React, { useEffect, useState } from 'react';

// Fallback function in case error-messages utility fails
const fallbackFormatError = (error: any) => {
  if (typeof error === 'string') return { title: 'Error', message: error, action: '' };
  if (error?.message) return { title: 'Error', message: error.message, action: '' };
  return { title: 'Error', message: 'An unexpected error occurred', action: '' };
};

let formatErrorForDisplay: (error: any) => { title: string; message: string; action: string };

// Dynamic import to handle potential import issues
try {
  formatErrorForDisplay = require('~/utils/error-messages').formatErrorForDisplay;
} catch {
  formatErrorForDisplay = fallbackFormatError;
}

interface ToastProps {
  message: any;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
  show?: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 5000,
  onClose,
  show = true
}) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  // Format error messages for toasts
  const formatMessage = () => {
    if (type === 'error') {
      const errorDetails = formatErrorForDisplay(message);
      return {
        title: errorDetails.title,
        message: errorDetails.message,
        action: errorDetails.action
      };
    }
    
    return {
      title: '',
      message: typeof message === 'string' ? message : message?.message || 'Notification',
      action: ''
    };
  };

  const { title, message: displayMessage, action } = formatMessage();

  return (
    <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-4 rounded-lg border shadow-lg max-w-md ${getTypeStyles()}`}>
      <div className="flex items-start gap-3">
        <div className={`w-4 h-4 rounded-full flex-shrink-0 mt-1 ${getIconColor()}`}></div>
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold typo-body_ls mb-1">{title}</h4>
          )}
          <p className="typo-body_lr mb-1">{displayMessage}</p>
          {action && (
            <p className="typo-body_xs italic opacity-80">{action}</p>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;