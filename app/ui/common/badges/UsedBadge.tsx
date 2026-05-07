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
            return 'bg-[#BEDAFF] text-[#00BBFF]';
        }
        if (normalized === 'used') {
            return 'bg-[#F2CAC2] text-[#FF674B]';
        }
        // Fairly used (default)
        return 'bg-[#FFF4EE] text-[#E46A2D]';
    };

    return (
        <span
            className={`flex items-center px-4 py-2 w-max rounded-lg font-poppins text-[12px] leading-[1.6] ${getStyles()}`}
        >
            {getVal()}
        </span>
    );
};

export default UsedBadge;
