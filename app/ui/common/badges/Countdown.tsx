import React from 'react';

const Countdown = ({text = 'new'}: {text?: string | null}) => {
    return (
        <span
            className={`flex items-center px-2 h-[26px] w-max xs:h-[18px] typo-body_sr ${text?.toLowerCase() === 'new' ? 'bg-[#D4E4E7] text-primary' : 'bg-[#FAE6D3] text-[#e47208]'} capitalize`}
        >
            3 days left
        </span>
    );
};

export default Countdown;
