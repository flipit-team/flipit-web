'use client';

import React, { useState, useEffect } from 'react';
import { NIGERIAN_LOCATIONS, State, LGA, formatLocation, parseLocation } from '~/data/nigerianLocations';

interface LocationSelectorProps {
  label?: string;
  value?: string; // Formatted location string (e.g., "Ikeja, Lagos, Nigeria")
  onChange: (location: string, codes: { stateCode: string; lgaCode?: string }) => void;
  placeholder?: string;
  showCountry?: boolean;
  required?: boolean;
  error?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  label = 'Location',
  value = '',
  onChange,
  placeholder = 'Select your location',
  showCountry = true,
  required = false,
  error
}) => {
  const [selectedCountry, setSelectedCountry] = useState(showCountry ? NIGERIAN_LOCATIONS.code : '');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedLGA, setSelectedLGA] = useState<string>('');
  
  const [availableStates, setAvailableStates] = useState<State[]>([]);
  const [availableLGAs, setAvailableLGAs] = useState<LGA[]>([]);

  // Parse initial value
  useEffect(() => {
    if (value) {
      const parsed = parseLocation(value);
      if (parsed) {
        setSelectedState(parsed.stateCode || '');
        setSelectedLGA(parsed.lgaCode || '');
      }
    }
  }, [value]);

  // Update available states when country changes
  useEffect(() => {
    if (selectedCountry === NIGERIAN_LOCATIONS.code) {
      setAvailableStates(NIGERIAN_LOCATIONS.states);
    } else {
      setAvailableStates([]);
      setSelectedState('');
      setSelectedLGA('');
    }
  }, [selectedCountry]);

  // Update available LGAs when state changes
  useEffect(() => {
    const state = availableStates.find(s => s.code === selectedState);
    if (state) {
      setAvailableLGAs(state.lgas);
    } else {
      setAvailableLGAs([]);
      setSelectedLGA('');
    }
  }, [selectedState, availableStates]);

  // Notify parent of changes
  useEffect(() => {
    if (selectedState) {
      const formattedLocation = formatLocation(selectedState, selectedLGA);
      const codes = { stateCode: selectedState, lgaCode: selectedLGA || undefined };
      onChange(formattedLocation, codes);
    }
  }, [selectedState, selectedLGA]);

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
  };

  const handleStateChange = (stateCode: string) => {
    setSelectedState(stateCode);
    setSelectedLGA(''); // Reset LGA when state changes
  };

  const handleLGAChange = (lgaCode: string) => {
    setSelectedLGA(lgaCode);
  };

  return (
    <div className="w-full">
      <label className="typo-body_mr text-text_one block mb-2">
        {label} {required && <span className="text-error">*</span>}
      </label>

      <div className="space-y-3">
        {/* Country Selector (if enabled) */}
        {showCountry && (
          <div>
            <select
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full h-[49px] px-4 border border-border_gray rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none typo-body_mr bg-white appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[position:calc(100%-16px)_center] bg-[length:12px_8px]"
              required={required}
            >
              <option value="">Select Country</option>
              <option value={NIGERIAN_LOCATIONS.code}>{NIGERIAN_LOCATIONS.name}</option>
            </select>
          </div>
        )}

        {/* State and LGA Selectors - Side by side */}
        <div className="grid grid-cols-2 gap-3">
          {/* State Selector */}
          <div>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              disabled={showCountry && !selectedCountry}
              className="w-full h-[49px] px-4 border border-border_gray rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none typo-body_mr bg-white disabled:bg-surface-secondary disabled:text-text_four appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[position:calc(100%-16px)_center] bg-[length:12px_8px]"
              required={required}
            >
              <option value="">Select State</option>
              {availableStates.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          {/* LGA Selector */}
          <div>
            <select
              value={selectedLGA}
              onChange={(e) => handleLGAChange(e.target.value)}
              disabled={!selectedState}
              className="w-full h-[49px] px-4 border border-border_gray rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none typo-body_mr bg-white disabled:bg-surface-secondary disabled:text-text_four appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[position:calc(100%-16px)_center] bg-[length:12px_8px]"
            >
              <option value="">Select Local Government Area</option>
              {availableLGAs.map((lga) => (
                <option key={lga.code} value={lga.code}>
                  {lga.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Current Selection Display */}
      {selectedState && (
        <div className="mt-3 p-3 bg-surface-primary-16 rounded-md">
          <div className="typo-body_sr text-text_secondary">
            <strong>Selected Location:</strong>
          </div>
          <div className="typo-body_mr text-text_primary">
            {formatLocation(selectedState, selectedLGA)}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-2 typo-body_sr text-text_four">
        {!selectedState && 'Please select your state first'}
        {selectedState && !selectedLGA && 'Optionally select your local government area for more precise location'}
        {selectedState && selectedLGA && 'Location selected successfully'}
      </div>

      {/* Error Message */}
      {error && (
        <p className="typo-body_sr text-error mt-2">{error}</p>
      )}
    </div>
  );
};

export default LocationSelector;