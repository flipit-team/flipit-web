'use client';

import React, { useState, useEffect } from 'react';

interface AuctionDurationSelectorProps {
  label?: string;
  value: number; // Duration in hours
  onChange: (hours: number) => void;
  error?: string;
}

const AuctionDurationSelector: React.FC<AuctionDurationSelectorProps> = ({
  label = 'Auction Duration',
  value,
  onChange,
  error
}) => {
  const [unit, setUnit] = useState<'hours' | 'days'>('hours');
  const [amount, setAmount] = useState<number>(1);

  // Convert hours to appropriate unit and amount on mount/value change
  useEffect(() => {
    if (value >= 24 && value % 24 === 0) {
      // If value is whole days, show in days
      setUnit('days');
      setAmount(value / 24);
    } else {
      // Otherwise show in hours
      setUnit('hours');
      setAmount(value);
    }
  }, [value]);

  const handleAmountChange = (newAmount: number) => {
    const maxAmount = unit === 'hours' ? 168 : 7; // Max 168 hours or 7 days
    const clampedAmount = Math.max(1, Math.min(newAmount, maxAmount));
    
    setAmount(clampedAmount);
    const totalHours = unit === 'hours' ? clampedAmount : clampedAmount * 24;
    onChange(totalHours);
  };

  const handleUnitChange = (newUnit: 'hours' | 'days') => {
    setUnit(newUnit);
    
    if (newUnit === 'days') {
      // Convert hours to days, rounding up
      const days = Math.ceil(amount / (unit === 'hours' ? 24 : 1));
      const clampedDays = Math.max(1, Math.min(days, 7));
      setAmount(clampedDays);
      onChange(clampedDays * 24);
    } else {
      // Convert days to hours
      const hours = amount * (unit === 'days' ? 24 : 1);
      const clampedHours = Math.max(1, Math.min(hours, 168));
      setAmount(clampedHours);
      onChange(clampedHours);
    }
  };

  const getMaxAmount = () => unit === 'hours' ? 168 : 7;

  // Quick preset options
  const presets = [
    { label: '12 hours', hours: 12 },
    { label: '1 day', hours: 24 },
    { label: '3 days', hours: 72 },
    { label: '7 days', hours: 168 },
  ];

  return (
    <div className="w-full">
      <label className="typo-body_mr text-text_one block mb-2">
        {label}
      </label>
      
      {/* Duration Input */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <input
            type="number"
            min="1"
            max={getMaxAmount()}
            value={amount}
            onChange={(e) => handleAmountChange(parseInt(e.target.value) || 1)}
            className="w-full h-[49px] px-4 border border-border_gray rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none typo-body_mr"
            placeholder={`Enter ${unit}`}
          />
        </div>
        
        {/* Unit Selector */}
        <div className="flex bg-surface-secondary rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => handleUnitChange('hours')}
            className={`px-4 py-2 typo-body_sr font-medium transition-colors ${
              unit === 'hours'
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
              unit === 'days'
                ? 'bg-primary text-white'
                : 'bg-white text-text_secondary hover:bg-surface-primary-16'
            }`}
          >
            Days
          </button>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mb-3">
        <p className="typo-body_sr text-text_three mb-2">Quick select:</p>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange(preset.hours)}
              className={`px-3 py-1.5 typo-body_sr rounded-md border transition-colors ${
                value === preset.hours
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-text_secondary border-border_gray hover:bg-surface-primary-16 hover:border-primary'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Validation Info */}
      <div className="typo-body_sr text-text_four">
        <p>Duration: {value} hours ({Math.floor(value / 24)}d {value % 24}h)</p>
        <p>Maximum duration: 7 days (168 hours)</p>
      </div>

      {error && (
        <p className="typo-body_sr text-error mt-2">{error}</p>
      )}
    </div>
  );
};

export default AuctionDurationSelector;