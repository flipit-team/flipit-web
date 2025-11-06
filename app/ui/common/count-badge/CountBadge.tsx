import React from 'react';

interface CountBadgeProps {
    count: number;
}

const CountBadge: React.FC<CountBadgeProps> = ({count}) => {
    if (count === 0) return null;

    return (
        <span
            className='absolute -top-2 -right-4 bg-secondary text-white text-[10px] font-bold rounded-full h-[18px] min-w-[18px] flex items-center justify-center px-1 shadow-md'
            style={{textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'}}
        >
            {count > 99 ? '99+' : count}
        </span>
    );
};

export default CountBadge;
