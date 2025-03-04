import React from 'react';

const UsedBadge = ({text}: {text: string}) => {
    return (
        <span className='flex items-center px-2 h-[26px] w-max xs:h-[18px] typo-body_small_regular bg-[#FAE6D3] text-[#e47208]'>
            {text}
        </span>
    );
};

export default UsedBadge;
