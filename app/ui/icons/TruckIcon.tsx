import React from 'react';

const TruckIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' />
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 4h1l2 10h13l2-8H5' />
    </svg>
);

export default TruckIcon;
