import React from 'react';
import ErrorDisplay from '../error-display/ErrorDisplay';

interface FormFieldProps {
  label: string;
  error?: string | null;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  description?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  error, 
  required = false, 
  children, 
  className = '',
  description 
}) => {
  return (
    <div className={`${className}`}>
      <label className="block typo-body_lr text-text_one mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {description && (
        <p className="typo-body_sr text-text_four mb-2">{description}</p>
      )}
      {children}
      {error && (
        <div className="mt-2">
          <ErrorDisplay error={error} className="!p-2 !bg-red-25 !border-red-100" />
        </div>
      )}
    </div>
  );
};

export default FormField;