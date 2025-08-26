'use client';
import React, { useState, useEffect } from 'react';

interface PhoneInputProps {
  label: string;
  name: string;
  value?: string;
  disabled?: boolean;
  setValue?: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
  placeholder?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  name,
  value = '',
  disabled,
  setValue,
  placeholder = 'Enter phone number'
}) => {
  const [displayValue, setDisplayValue] = useState('');
  const [rawValue, setRawValue] = useState('');

  // Format phone number for display
  const formatPhoneNumber = (input: string) => {
    // Remove all non-digit characters
    let digits = input.replace(/\D/g, '');
    
    // Remove leading zero if present
    if (digits.startsWith('0')) {
      digits = digits.substring(1);
    }
    
    // Limit to 10 digits (Nigerian mobile numbers)
    digits = digits.substring(0, 10);
    
    // Format as XXX XXX XXXX
    if (digits.length >= 7) {
      return `${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
    } else if (digits.length >= 4) {
      return `${digits.substring(0, 3)} ${digits.substring(3)}`;
    } else {
      return digits;
    }
  };

  // Get the full international number
  const getFullPhoneNumber = (digits: string) => {
    if (!digits) return '';
    
    // Remove all non-digit characters
    let cleanDigits = digits.replace(/\D/g, '');
    
    // Remove leading zero if present
    if (cleanDigits.startsWith('0')) {
      cleanDigits = cleanDigits.substring(1);
    }
    
    // Only return full number if we have digits
    if (cleanDigits.length > 0) {
      return `+234${cleanDigits.substring(0, 10)}`;
    }
    
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Remove all non-digit characters
    let digits = inputValue.replace(/\D/g, '');
    
    // Remove leading zero if present
    if (digits.startsWith('0')) {
      digits = digits.substring(1);
    }
    
    // Limit to 10 digits
    digits = digits.substring(0, 10);
    
    // Update display value
    const formatted = formatPhoneNumber(digits);
    setDisplayValue(formatted);
    setRawValue(digits);
    
    // Create a synthetic event with the full phone number for the parent component
    const fullPhoneNumber = getFullPhoneNumber(digits);
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: fullPhoneNumber
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    // Call parent's setValue with the full international number
    
    if (setValue) {
      setValue(syntheticEvent, name);
    }
  };

  // Initialize display value from prop value
  useEffect(() => {
    if (value) {
      // If value starts with +234, extract the local number
      let localNumber = value.replace('+234', '').replace(/\D/g, '');
      if (localNumber) {
        setDisplayValue(formatPhoneNumber(localNumber));
        setRawValue(localNumber);
      }
    }
  }, [value]);

  return (
    <div className='w-full'>
      <label htmlFor={name} className='block mb-2 typo-body_mr'>
        {label}
      </label>
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <span className='text-gray-500 typo-body_mr'>+234</span>
        </div>
        <input
          value={displayValue}
          onChange={handleInputChange}
          type='tel'
          id={name}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          className='h-[49px] w-full pl-16 pr-4 border border-border_gray rounded-md shadow-sm focus:ring-transparent outline-none'
        />
      </div>
      <p className='mt-1 text-xs text-gray-500'>
        Enter your Nigerian mobile number (e.g., 0806 123 4567)
      </p>
    </div>
  );
};

export default PhoneInput;