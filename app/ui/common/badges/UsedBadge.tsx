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
            className={`flex items-center px-2 h-[26px] w-max xs:h-[18px] typo-body_small_regular ${text?.toLowerCase() === 'new' ? 'bg-[#D4E4E7] text-primary' : 'bg-[#FAE6D3] text-[#e47208]'} capitalize`}
        >
            {getVal()}
        </span>
    );
};

export default UsedBadge;
