'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { NIGERIAN_LOCATIONS, formatLocation } from '~/data/nigerianLocations';

interface LocationFilterProps {
  selectedState?: string;
  selectedLGA?: string;
  onLocationChange: (stateCode: string, lgaCode?: string) => void;
  className?: string;
}

const LocationFilter: React.FC<LocationFilterProps> = ({
  selectedState,
  selectedLGA,
  onLocationChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempState, setTempState] = useState(selectedState || '');
  const [tempLGA, setTempLGA] = useState(selectedLGA || '');

  const currentLocation = selectedState 
    ? formatLocation(selectedState, selectedLGA)
    : 'Select Location';

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

  const selectedStateObj = NIGERIAN_LOCATIONS.states.find(s => s.code === tempState);

  return (
    <div className={`relative ${className}`}>
      {/* Location Display Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='border border-border_gray h-[37px] px-4 flex items-center rounded-md bg-white hover:bg-surface-primary-16 transition-colors'
      >
        <Image src={'/location.svg'} height={24} width={24} alt='location' className='h-6 w-6 mr-2' />
        <p className='typo-body_mr text-text_primary truncate max-w-[200px]'>{displayLocation}</p>
        <Image 
          src={'/arrow-down.svg'} 
          height={16} 
          width={16} 
          alt='dropdown' 
          className={`h-4 w-4 ml-2 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className='absolute top-full left-0 mt-2 w-80 bg-white border border-border_gray rounded-lg shadow-lg z-50'>
          <div className='p-4'>
            <h3 className='typo-body_lm text-text_primary mb-4'>Filter by Location</h3>
            
            {/* State Selector */}
            <div className='mb-3'>
              <label className='typo-body_sr text-text_secondary block mb-2'>State</label>
              <select
                value={tempState}
                onChange={(e) => {
                  setTempState(e.target.value);
                  setTempLGA(''); // Reset LGA when state changes
                }}
                className='w-full h-[40px] px-3 border border-border_gray rounded-md text-text_primary typo-body_sr focus:ring-2 focus:ring-primary focus:border-primary outline-none'
              >
                <option value=''>All States</option>
                {NIGERIAN_LOCATIONS.states.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            {/* LGA Selector */}
            {tempState && selectedStateObj && (
              <div className='mb-4'>
                <label className='typo-body_sr text-text_secondary block mb-2'>Local Government Area</label>
                <select
                  value={tempLGA}
                  onChange={(e) => setTempLGA(e.target.value)}
                  className='w-full h-[40px] px-3 border border-border_gray rounded-md text-text_primary typo-body_sr focus:ring-2 focus:ring-primary focus:border-primary outline-none'
                >
                  <option value=''>All LGAs in {selectedStateObj.name}</option>
                  {selectedStateObj.lgas.map((lga) => (
                    <option key={lga.code} value={lga.code}>
                      {lga.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div className='flex gap-2 pt-2 border-t border-border_gray'>
              <button
                onClick={handleClear}
                className='flex-1 h-[36px] border border-border_gray text-text_secondary rounded-md hover:bg-surface-secondary transition-colors typo-body_sr'
              >
                Clear
              </button>
              <button
                onClick={handleApply}
                className='flex-1 h-[36px] bg-primary text-white rounded-md hover:bg-primary-dark transition-colors typo-body_sr'
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div 
          className='fixed inset-0 z-40' 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LocationFilter;