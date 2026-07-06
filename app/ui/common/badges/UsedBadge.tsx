import React from 'react';

const UsedBadge = ({text}: {text?: string | null}) => {
    const normalized = text?.toLowerCase() || '';

    const getVal = () => {
        if (normalized === 'new' || normalized === 'brand new') return 'Brand new';
        if (normalized === 'used') return 'Used';
        return 'Fairly used';
    };

    const getStyles = () => {
        if (normalized === 'new' || normalized === 'brand new') {
            return 'bg-surface-blue text-info-light';
        }
        if (normalized === 'used') {
            return 'bg-surface-coral-dark text-accent-coral';
        }
        // Fairly used (default)
        return 'bg-surface-coral text-warning-dark';
    };

    return (
        <span
            className={`flex items-center px-4 py-2 w-max rounded-lg typo-body-sm-regular ${getStyles()}`}
        >
            {getVal()}
        </span>
    );
};

export default UsedBadge;
