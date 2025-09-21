import React from 'react';
import { formatErrorForDisplay } from '~/utils/error-messages';

interface ErrorDisplayProps {
  error: any;
  className?: string;
  showTechnical?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  className = '',
  showTechnical = false
}) => {
  if (!error) return null;

  const errorDetails = formatErrorForDisplay(error);

  return (
    <div className={`p-3 bg-red-50 border border-red-200 rounded-lg ${className}`}>
      <div className='flex items-start gap-3'>
        <div className='w-4 h-4 rounded-full bg-red-500 flex-shrink-0 mt-1'></div>
        <div className='flex-1'>
          <p className='text-red-700 typo-body_lr'>
            {errorDetails.message}
          </p>
          {showTechnical && errorDetails.technical && (
            <details className='mt-2'>
              <summary className='cursor-pointer text-red-600 typo-body_xs font-mono'>
                Technical Details (Dev Mode)
              </summary>
              <pre className='mt-1 text-red-500 typo-body_xs font-mono whitespace-pre-wrap bg-red-100 p-2 rounded border overflow-x-auto'>
                {errorDetails.technical}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;