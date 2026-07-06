import React from 'react';

const SwapArrowsIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' />
    </svg>
);

export default SwapArrowsIcon;
