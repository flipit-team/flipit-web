'use client';
import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { formatErrorForDisplay } from '~/utils/error-messages';

interface ToastContextValue {
  showToast: (message: any, type?: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;
  showError: (error: any, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Return no-op functions if context is not available (e.g., during SSR)
    return {
      showToast: () => {},
      showError: () => {},
      showSuccess: () => {},
      showWarning: () => {},
      showInfo: () => {},
    };
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const showToast = useCallback((message: any, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 5000) => {
    const toastMessage = typeof message === 'string' ? message : message?.message || 'Notification';

    switch (type) {
      case 'success':
        toast.success(toastMessage, { duration });
        break;
      case 'error':
        toast.error(toastMessage, { duration });
        break;
      case 'warning':
        toast(toastMessage, { duration, icon: '⚠️' });
        break;
      case 'info':
      default:
        toast(toastMessage, { duration, icon: 'ℹ️' });
        break;
    }
  }, []);

  const showError = useCallback((error: any, duration: number = 7000) => {
    const errorDetails = formatErrorForDisplay(error);
    const errorMessage = errorDetails.title
      ? `${errorDetails.title}: ${errorDetails.message}`
      : errorDetails.message;
    toast.error(errorMessage, { duration });
  }, []);

  const showSuccess = useCallback((message: string, duration: number = 4000) => {
    toast.success(message, { duration });
  }, []);

  const showWarning = useCallback((message: string, duration: number = 5000) => {
    toast(message, { duration, icon: '⚠️' });
  }, []);

  const showInfo = useCallback((message: string, duration: number = 5000) => {
    toast(message, { duration, icon: 'ℹ️' });
  }, []);

  const contextValue: ToastContextValue = {
    showToast,
    showError,
    showSuccess,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
          style: {
            maxWidth: '500px',
          },
          error: {
            style: {
              background: '#DC2626',
              color: '#fff',
            },
          },
          success: {
            style: {
              background: '#16A34A',
              color: '#fff',
            },
          },
        }}
      />
    </ToastContext.Provider>
  );
};