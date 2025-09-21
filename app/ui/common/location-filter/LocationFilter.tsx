'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { NIGERIAN_LOCATIONS } from '~/data/nigerianLocations';

interface LocationFilterProps {
  selectedState?: string;
  selectedLGA?: string;
  onLocationChange: (stateCode: string, lgaCode?: string) => void;
  className?: string;
}

// Custom Select Component
interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ code: string; name: string }>;
  placeholder: string;
  label: string;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  label,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.code === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <label className='typo-body_sm text-gray-700 block mb-2 font-medium'>{label}</label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className='w-full h-12 px-4 border border-gray-300 rounded-lg text-left bg-white hover:border-gray-400 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors flex items-center justify-between'
      >
        <span className={`typo-body_mr ${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      {isOpen && (
        <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto'>
          <button
            type="button"
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
            className={`w-full px-4 py-3 text-left hover:bg-gray-50 typo-body_mr transition-colors ${
              !value ? 'text-primary bg-primary/5' : 'text-gray-500'
            }`}
          >
            {placeholder}
          </button>
          {options.map((option) => (
            <button
              key={option.code}
              type="button"
              onClick={() => {
                onChange(option.code);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 typo-body_mr transition-colors ${
                value === option.code ? 'text-primary bg-primary/5' : 'text-gray-900'
              }`}
            >
              {option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const LocationFilter: React.FC<LocationFilterProps> = ({
  selectedState,
  selectedLGA,
  onLocationChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempState, setTempState] = useState(selectedState || '');
  const [tempLGA, setTempLGA] = useState(selectedLGA || '');
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const displayLocation = selectedState
    ? (selectedLGA
        ? `${NIGERIAN_LOCATIONS.states.find(s => s.code === selectedState)?.lgas.find(l => l.code === selectedLGA)?.name}, ${NIGERIAN_LOCATIONS.states.find(s => s.code === selectedState)?.name}`
        : NIGERIAN_LOCATIONS.states.find(s => s.code === selectedState)?.name
      )
    : 'All Nigeria';

  const handleApply = () => {
    onLocationChange(tempState, tempLGA);
    setIsOpen(false);
  };

  const handleClear = () => {
    setTempState('');
    setTempLGA('');
    onLocationChange('');
    setIsOpen(false);
  };

  const handleClose = () => {
    setTempState(selectedState || '');
    setTempLGA(selectedLGA || '');
    setIsOpen(false);
  };

  const selectedStateObj = NIGERIAN_LOCATIONS.states.find(s => s.code === tempState);

  // Mobile Modal Component
  const MobileModal = () => (
    <div className='fixed inset-0 z-50 flex items-end'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black bg-opacity-50'
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className='relative w-full bg-white rounded-t-2xl max-h-[85vh] overflow-hidden animate-slide-up'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10'>
          <h2 className='typo-heading_sr text-gray-900 font-semibold'>Filter by Location</h2>
          <button
            onClick={handleClose}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors'
          >
            <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className='p-4 space-y-6 overflow-y-auto' style={{maxHeight: 'calc(85vh - 140px)'}}>
          <CustomSelect
            value={tempState}
            onChange={(value) => {
              setTempState(value);
              setTempLGA('');
            }}
            options={NIGERIAN_LOCATIONS.states}
            placeholder="All States"
            label="State"
          />

          {tempState && selectedStateObj && (
            <CustomSelect
              value={tempLGA}
              onChange={setTempLGA}
              options={selectedStateObj.lgas}
              placeholder={`All LGAs in ${selectedStateObj.name}`}
              label="Local Government Area"
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className='p-4 border-t border-gray-200 bg-gray-50 sticky bottom-0'>
          <div className='flex gap-3'>
            <button
              onClick={handleClear}
              className='flex-1 h-12 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors typo-body_mr font-medium'
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              className='flex-1 h-12 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors typo-body_mr font-medium'
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop Dropdown Component
  const DesktopDropdown = () => (
    <div className='absolute top-full right-0 mt-2 w-96 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden'>
      {/* Header */}
      <div className='px-6 py-4 bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100'>
        <h3 className='typo-body_lm text-gray-900 font-semibold'>Filter by Location</h3>
        <p className='typo-body_sr text-gray-600 mt-1'>Select your preferred location</p>
      </div>

      {/* Content */}
      <div className='p-6 space-y-4'>
        <CustomSelect
          value={tempState}
          onChange={(value) => {
            setTempState(value);
            setTempLGA('');
          }}
          options={NIGERIAN_LOCATIONS.states}
          placeholder="All States"
          label="State"
          className="mb-4"
        />

        {tempState && selectedStateObj && (
          <CustomSelect
            value={tempLGA}
            onChange={setTempLGA}
            options={selectedStateObj.lgas}
            placeholder={`All LGAs in ${selectedStateObj.name}`}
            label="Local Government Area"
            className="mb-6"
          />
        )}

        {/* Action Buttons */}
        <div className='flex gap-3 pt-2'>
          <button
            onClick={handleClear}
            className='flex-1 h-10 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors typo-body_sr font-medium'
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            className='flex-1 h-10 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors typo-body_sr font-medium'
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      {/* Location Display Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='border border-border_gray h-[37px] xs:h-[34px] px-4 xs:px-3 flex items-center rounded-md hover:bg-white/10 transition-colors'
      >
        <Image src={'/location.svg'} height={24} width={24} alt='location' className='h-6 w-6 xs:h-5 xs:w-5 mr-2 brightness-0 invert' />
        <p className='typo-body_mr xs:typo-body_sr text-white truncate max-w-[200px]'>{displayLocation}</p>
        <Image
          src={'/arrow-down.svg'}
          height={16}
          width={16}
          alt='dropdown'
          className={`h-4 w-4 xs:h-3 xs:w-3 ml-2 transform transition-transform brightness-0 invert ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Render appropriate dropdown based on screen size */}
      {isOpen && (isMobile ? <MobileModal /> : <DesktopDropdown />)}

      {/* Desktop overlay to close dropdown when clicking outside */}
      {isOpen && !isMobile && (
        <div
          className='fixed inset-0 z-40'
          onClick={handleClose}
        />
      )}
    </div>
  );
};

export default LocationFilter;