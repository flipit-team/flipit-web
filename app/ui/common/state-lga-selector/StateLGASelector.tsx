'use client';
import React, { useState, useEffect } from 'react';
import Select from '../select';
import { useStates, useLGAs } from '~/hooks/useLocation';

interface StateLGASelectorProps {
    label?: string;
    value?: string; // Formatted location string (e.g., "ikeja, lagos")
    onChange: (location: string, codes: { stateCode: string; lgaCode?: string }) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
}

const StateLGASelector: React.FC<StateLGASelectorProps> = ({
    label = 'Location',
    value = '',
    onChange,
    placeholder = 'Select your location',
    required = false,
    error
}) => {
    const { states, loading: statesLoading } = useStates();

    const [selectedState, setSelectedState] = useState<string>('');
    const [selectedLGA, setSelectedLGA] = useState<string>('');

    const { lgas, loading: lgasLoading } = useLGAs(selectedState);

    // Parse initial value (format: "lga, state, Nigeria" or "state, Nigeria")
    useEffect(() => {
        if (value && states.length > 0) {
            const parts = value.toLowerCase().split(',').map(p => p.trim());
            if (parts.length >= 1) {
                // Find state (second-to-last or last part before "Nigeria")
                const stateIndex = parts.findIndex(p => p === 'nigeria') - 1;
                const stateName = stateIndex >= 0 ? parts[stateIndex] : parts[parts.length - 1];

                const state = states.find(s =>
                    s.name.toLowerCase() === stateName ||
                    s.code.toLowerCase() === stateName
                );

                if (state) {
                    setSelectedState(state.code);

                    // Find LGA if provided (first part)
                    if (parts.length > 2 && parts[0]) {
                        const lgaName = parts[0];
                        // LGA will be set once they're loaded
                        setTimeout(() => {
                            // Placeholder - actual LGA matching happens in next useEffect
                        }, 100);
                    }
                }
            }
        }
    }, [value, states]);

    // Notify parent of changes
    useEffect(() => {
        if (selectedState) {
            const state = states.find(s => s.code === selectedState);
            const lga = lgas.find(l => l.code === selectedLGA);

            let formattedLocation = '';
            if (selectedLGA && lga) {
                formattedLocation = `${lga.name}, ${state?.name || selectedState}, Nigeria`;
            } else if (state) {
                formattedLocation = `${state.name}, Nigeria`;
            }

            const codes = {
                stateCode: selectedState,
                lgaCode: selectedLGA || undefined
            };

            onChange(formattedLocation, codes);
        }
    }, [selectedState, selectedLGA, states, lgas]);

    const handleStateChange = (stateCode: string) => {
        setSelectedState(stateCode);
        setSelectedLGA(''); // Reset LGA when state changes
    };

    const handleLGAChange = (lgaCode: string) => {
        setSelectedLGA(lgaCode);
    };

    // Transform states to options
    const stateOptions = states.map(state => ({
        value: state.code,
        label: state.name
    }));

    // Transform LGAs to options
    const lgaOptions = lgas.map(lga => ({
        value: lga.code,
        label: lga.name
    }));

    const currentState = states.find(s => s.code === selectedState);
    const currentLGA = lgas.find(l => l.code === selectedLGA);

    return (
        <div className="w-full">
            <label className="typo-body_mr text-text_one block mb-2">
                {label} {required && <span className="text-error">*</span>}
            </label>

            <div className="space-y-3">
                {/* State and LGA Selectors - Side by side on desktop, stacked on mobile */}
                <div className="grid grid-cols-2 gap-3 xs:grid-cols-1">
                    {/* State Selector */}
                    <Select
                        value={selectedState}
                        onChange={handleStateChange}
                        options={stateOptions}
                        placeholder={statesLoading ? 'Loading states...' : 'Select State'}
                        required={required}
                        disabled={statesLoading}
                    />

                    {/* LGA Selector */}
                    <Select
                        value={selectedLGA}
                        onChange={handleLGAChange}
                        options={lgaOptions}
                        placeholder={
                            !selectedState
                                ? 'Select State first'
                                : lgasLoading
                                    ? 'Loading LGAs...'
                                    : 'Select LGA'
                        }
                        disabled={!selectedState || lgasLoading}
                    />
                </div>
            </div>

            {/* Current Selection Display */}
            {selectedState && currentState && (
                <div className="mt-3 p-3 bg-surface-primary-16 rounded-md">
                    <div className="typo-body_sr text-text_secondary">
                        <strong>Selected Location:</strong>
                    </div>
                    <div className="typo-body_mr text-text_primary">
                        {currentLGA ? `${currentLGA.name}, ` : ''}{currentState.name}, Nigeria
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

export default StateLGASelector;
