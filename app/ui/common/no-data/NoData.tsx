import React from 'react';

const NoData = ({text}: {text?: string}) => {
    return (
        <div className='w-full min-h-[60vh] typo-heading_ms flex justify-center items-center text-gray-500'>
            <div className='text-center'>
                <div className='mb-2'>{text ?? 'No Items Available'}</div>
                <div className='text-sm typo-body_lr opacity-70'>
                    {text?.includes('saved') ? 'Start saving items to see them here' : 
                     text?.includes('bid') ? 'You haven\'t placed any bids yet' :
                     'Check back later for new items'}
                </div>
            </div>
        </div>
    );
};

export default NoData;
