import React from 'react';

const UsedBadge = ({text}: {text?: string | null}) => {
    const getVal = () => {
        if (text?.toLowerCase() === 'new') {
            return 'Brand New';
        }
        return 'Fairly Used';
    };

    return (
        <span
            className={`flex items-center px-2 h-[26px] w-max xs:h-[18px] typo-body_sr ${text?.toLowerCase() === 'new' ? 'bg-surface-light text-primary' : 'bg-surface-cream text-warning'} capitalize`}
        >
            {getVal()}
        </span>
    );
};

export default UsedBadge;
