import React from 'react';

interface Props {
    isLight?: boolean;
    text: string;
}

const RegularButton = ({isLight, text}: Props) => {
    return (
        <div
            className={`w-full flex items-center justify-center h-[51px] ${isLight ? 'bg-[#005f7329]' : 'bg-primary'} rounded-lg ${isLight ? 'text-primary' : 'text-white'} typo-body_large_semibold`}
        >
            {text}
        </div>
    );
};

export default RegularButton;
