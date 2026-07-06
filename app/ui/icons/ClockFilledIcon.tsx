import React from 'react';

const ClockFilledIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill='currentColor' viewBox='0 0 24 24'>
        <path d='M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.5 13.5l-4.5-3V7h2v4.67l3.5 2.33-1 1.5z' />
    </svg>
);

export default ClockFilledIcon;
