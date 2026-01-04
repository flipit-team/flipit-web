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

// Common country codes
const COUNTRY_CODES = [
  { code: '+234', country: 'NG', name: 'Nigeria', maxLength: 10 },
  { code: '+1', country: 'US', name: 'United States', maxLength: 10 },
  { code: '+44', country: 'GB', name: 'United Kingdom', maxLength: 10 },
  { code: '+91', country: 'IN', name: 'India', maxLength: 10 },
  { code: '+86', country: 'CN', name: 'China', maxLength: 11 },
  { code: '+81', country: 'JP', name: 'Japan', maxLength: 10 },
  { code: '+33', country: 'FR', name: 'France', maxLength: 9 },
  { code: '+49', country: 'DE', name: 'Germany', maxLength: 11 },
  { code: '+39', country: 'IT', name: 'Italy', maxLength: 10 },
  { code: '+34', country: 'ES', name: 'Spain', maxLength: 9 },
  { code: '+27', country: 'ZA', name: 'South Africa', maxLength: 9 },
  { code: '+254', country: 'KE', name: 'Kenya', maxLength: 9 },
  { code: '+233', country: 'GH', name: 'Ghana', maxLength: 9 },
  { code: '+20', country: 'EG', name: 'Egypt', maxLength: 10 },
  { code: '+971', country: 'AE', name: 'UAE', maxLength: 9 },
];

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
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]); // Default to Nigeria

  // Format phone number for display
  const formatPhoneNumber = (input: string) => {
    // Remove all non-digit characters
    let digits = input.replace(/\D/g, '');

    // Remove leading zero if present
    if (digits.startsWith('0')) {
      digits = digits.substring(1);
    }

    // Limit to max length for selected country
    digits = digits.substring(0, selectedCountry.maxLength);

    // Format as XXX XXX XXXX for better readability
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
      return `${selectedCountry.code}${cleanDigits.substring(0, selectedCountry.maxLength)}`;
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

    // Limit to country's max length
    digits = digits.substring(0, selectedCountry.maxLength);

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

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = COUNTRY_CODES.find(c => c.code === e.target.value) || COUNTRY_CODES[0];
    setSelectedCountry(newCountry);

    // Re-format existing value with new country code
    if (rawValue) {
      const fullPhoneNumber = `${newCountry.code}${rawValue.substring(0, newCountry.maxLength)}`;
      const syntheticEvent = {
        target: {
          value: fullPhoneNumber
        }
      } as React.ChangeEvent<HTMLInputElement>;

      if (setValue) {
        setValue(syntheticEvent, name);
      }
    }
  };

  // Initialize display value from prop value
  useEffect(() => {
    if (value) {
      // Find which country code the value starts with
      const matchedCountry = COUNTRY_CODES.find(c => value.startsWith(c.code));
      if (matchedCountry) {
        setSelectedCountry(matchedCountry);
        // Extract the local number after the country code
        let localNumber = value.replace(matchedCountry.code, '').replace(/\D/g, '');
        if (localNumber) {
          setDisplayValue(formatPhoneNumber(localNumber));
          setRawValue(localNumber);
        }
      }
    }
  }, [value]);

  return (
    <div className='w-full'>
      <label htmlFor={name} className='block mb-2 typo-body_mr'>
        {label}
      </label>
      <div className='flex gap-2'>
        <div className='relative'>
          <select
            value={selectedCountry.code}
            onChange={handleCountryChange}
            disabled={disabled}
            className='h-[49px] w-24 pl-3 pr-8 border border-border_gray rounded-md shadow-sm focus:ring-transparent outline-none bg-white typo-body_mr appearance-none'
          >
            {COUNTRY_CODES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.code}
              </option>
            ))}
          </select>
          <div className='absolute inset-y-0 right-2 flex items-center pointer-events-none'>
            <svg className='h-4 w-4 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
            </svg>
          </div>
        </div>
        <input
          value={displayValue}
          onChange={handleInputChange}
          type='tel'
          id={name}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          className='h-[49px] flex-1 px-4 border border-border_gray rounded-md shadow-sm focus:ring-transparent outline-none'
        />
      </div>
      <p className='mt-1 text-xs text-gray-500'>
        Enter your mobile number (e.g., 806 123 4567)
      </p>
    </div>
  );
};

export default PhoneInput;