'use client';
import React, { useState, useEffect } from 'react';
import Select from '../select';
import { useStates, useLGAs } from '~/hooks/useLocation';

interface StateLGASelectorProps {
    stateCode?: string;
    lgaCode?: string;
    onStateChange: (stateCode: string) => void;
    onLGAChange: (lgaCode: string) => void;
    stateLabel?: string;
    lgaLabel?: string;
    required?: boolean;
    disabled?: boolean;
}

const StateLGASelector: React.FC<StateLGASelectorProps> = ({
    stateCode = '',
    lgaCode = '',
    onStateChange,
    onLGAChange,
    stateLabel = 'State',
    lgaLabel = 'LGA (Local Government Area)',
    required = false,
    disabled = false
}) => {
    const { states, loading: statesLoading } = useStates();
    const { lgas, loading: lgasLoading } = useLGAs(stateCode);

    const [selectedState, setSelectedState] = useState(stateCode);
    const [selectedLGA, setSelectedLGA] = useState(lgaCode);

    // Update local state when props change
    useEffect(() => {
        setSelectedState(stateCode);
    }, [stateCode]);

    useEffect(() => {
        setSelectedLGA(lgaCode);
    }, [lgaCode]);

    const handleStateChange = (value: string) => {
        setSelectedState(value);
        setSelectedLGA(''); // Reset LGA when state changes
        onStateChange(value);
        onLGAChange(''); // Clear LGA selection
    };

    const handleLGAChange = (value: string) => {
        setSelectedLGA(value);
        onLGAChange(value);
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

    return (
        <div className='flex flex-col gap-4'>
            <Select
                label={stateLabel}
                value={selectedState}
                onChange={handleStateChange}
                options={stateOptions}
                placeholder={statesLoading ? 'Loading states...' : 'Select state'}
                required={required}
                disabled={disabled || statesLoading}
            />

            <Select
                label={lgaLabel}
                value={selectedLGA}
                onChange={handleLGAChange}
                options={lgaOptions}
                placeholder={
                    !selectedState
                        ? 'Select state first'
                        : lgasLoading
                            ? 'Loading LGAs...'
                            : 'Select LGA'
                }
                required={required}
                disabled={disabled || !selectedState || lgasLoading}
            />
        </div>
    );
};

export default StateLGASelector;
