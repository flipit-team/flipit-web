'use client';

import React, { useState, useEffect } from 'react';

interface Props {
  label?: string;
  value: string; // ISO date string
  onChange: (value: string) => void;
  required?: boolean;
}

const AuctionStartSelector: React.FC<Props> = ({
  label = 'Auction Start',
  value,
  onChange,
  required = false
}) => {
  const [selectedUnit, setSelectedUnit] = useState<'hours' | 'days'>('hours');
  const [timeValue, setTimeValue] = useState(1);
  
  // Get current date/time for calculations
  const now = new Date();
  const maxDateTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Maximum 7 days from now


  const handleQuickSelect = (hours: number) => {
    const newDate = new Date(now.getTime() + hours * 60 * 60 * 1000);
    onChange(newDate.toISOString());
  };

  const handleTimeChange = (newValue: number) => {
    setTimeValue(newValue);
    const hoursFromNow = selectedUnit === 'hours' ? newValue : newValue * 24;
    const newDate = new Date(now.getTime() + hoursFromNow * 60 * 60 * 1000);
    
    // Ensure within 7-day limit
    if (newDate <= maxDateTime) {
      onChange(newDate.toISOString());
    }
  };

  const handleUnitChange = (unit: 'hours' | 'days') => {
    setSelectedUnit(unit);
    const currentHours = Math.ceil((new Date(value).getTime() - now.getTime()) / (60 * 60 * 1000));
    
    if (unit === 'hours') {
      const newValue = Math.min(currentHours, 168); // Max 168 hours (7 days)
      setTimeValue(newValue);
      handleTimeChange(newValue);
    } else {
      const newValue = Math.min(Math.ceil(currentHours / 24), 7); // Max 7 days
      setTimeValue(newValue);
      handleTimeChange(newValue);
    }
  };


  // Format display text
  const formatStartTime = () => {
    if (!value) return 'Select start time';
    const startDate = new Date(value);
    const diffMs = startDate.getTime() - now.getTime();
    const diffHours = Math.round(diffMs / (60 * 60 * 1000));
    const diffDays = Math.round(diffHours / 24);

    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} from now`;
    } else if (diffDays <= 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} from now`;
    }
    
    return startDate.toLocaleString();
  };

  return (
    <div className="w-full">
      <label className="typo-body_mr text-text_one block mb-2">
        {label}{required && <span className="text-error ml-1">*</span>}
      </label>

      {/* Time Input and Unit Toggle on same line */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <input
            type="number"
            value={timeValue}
            onChange={(e) => handleTimeChange(Math.max(1, parseInt(e.target.value) || 1))}
            min={1}
            max={selectedUnit === 'hours' ? 168 : 7}
            className="w-full h-[49px] px-4 border border-border_gray rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none typo-body_mr"
            placeholder={`Enter ${selectedUnit}`}
          />
        </div>
        
        {/* Unit Selector */}
        <div className="flex bg-surface-secondary rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => handleUnitChange('hours')}
            className={`px-4 py-2 typo-body_sr font-medium transition-colors ${
              selectedUnit === 'hours'
                ? 'bg-primary text-white'
                : 'bg-white text-text_secondary hover:bg-surface-primary-16'
            }`}
          >
            Hours
          </button>
          <button
            type="button"
            onClick={() => handleUnitChange('days')}
            className={`px-4 py-2 typo-body_sr font-medium transition-colors ${
              selectedUnit === 'days'
                ? 'bg-primary text-white'
                : 'bg-white text-text_secondary hover:bg-surface-primary-16'
            }`}
          >
            Days
          </button>
        </div>
      </div>

      {/* Quick Select Options */}
      <div className="mb-3">
        <p className="typo-body_sr text-text_three mb-2">Quick select:</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleQuickSelect(1)}
            className="px-3 py-1.5 typo-body_sr rounded-md border transition-colors bg-white text-text_secondary border-border_gray hover:bg-surface-primary-16 hover:border-primary hover:text-primary-light"
          >
            1 hour
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect(12)}
            className="px-3 py-1.5 typo-body_sr rounded-md border transition-colors bg-white text-text_secondary border-border_gray hover:bg-surface-primary-16 hover:border-primary hover:text-primary-light"
          >
            12 hours
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect(24)}
            className="px-3 py-1.5 typo-body_sr rounded-md border transition-colors bg-white text-text_secondary border-border_gray hover:bg-surface-primary-16 hover:border-primary hover:text-primary-light"
          >
            1 day
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect(72)}
            className="px-3 py-1.5 typo-body_sr rounded-md border transition-colors bg-white text-text_secondary border-border_gray hover:bg-surface-primary-16 hover:border-primary hover:text-primary-light"
          >
            3 days
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect(168)}
            className="px-3 py-1.5 typo-body_sr rounded-md border transition-colors bg-white text-text_secondary border-border_gray hover:bg-surface-primary-16 hover:border-primary hover:text-primary-light"
          >
            7 days
          </button>
        </div>
      </div>


      {/* Display Selected Time */}
      <div className="p-3 bg-surface-primary-16 rounded-md">
        <div className="typo-body-sm-regular text-text-secondary">
          <strong>Auction will start:</strong>
        </div>
        <div className="typo-body-md-regular text-text-primary">
          {formatStartTime()}
        </div>
      </div>

      {/* Validation Info */}
      <div className="mt-2 typo-body-sm-regular text-text-tertiary">
        Auction can start between 1 hour and 7 days from now
      </div>
    </div>
  );
};

export default AuctionStartSelector;