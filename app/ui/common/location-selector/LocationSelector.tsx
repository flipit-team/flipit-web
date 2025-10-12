'use client';

import React, { useState, useEffect } from 'react';
import { NIGERIAN_LOCATIONS, State, LGA, formatLocation, parseLocation } from '~/data/nigerianLocations';
import Select from '../select';

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
          <Select
            value={selectedCountry}
            onChange={handleCountryChange}
            options={[
              {value: NIGERIAN_LOCATIONS.code, label: NIGERIAN_LOCATIONS.name}
            ]}
            placeholder="Select Country"
            required={required}
          />
        )}

        {/* State and LGA Selectors - Side by side */}
        <div className="grid grid-cols-2 gap-3">
          {/* State Selector */}
          <Select
            value={selectedState}
            onChange={handleStateChange}
            options={availableStates.map(state => ({value: state.code, label: state.name}))}
            placeholder="Select State"
            required={required}
            disabled={showCountry && !selectedCountry}
          />

          {/* LGA Selector */}
          <Select
            value={selectedLGA}
            onChange={handleLGAChange}
            options={availableLGAs.map(lga => ({value: lga.code, label: lga.name}))}
            placeholder="Select LGA"
            disabled={!selectedState}
          />
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
        {selectedState && !selectedLGA && (
          <>
            <span className="xs:hidden">Optionally select your local government area for more precise location</span>
            <span className="hidden xs:inline">Optionally select your LGA for more precise location</span>
          </>
        )}
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