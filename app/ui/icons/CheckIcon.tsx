import React from 'react';

const CheckIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
    </svg>
);

export default CheckIcon;
