import React from 'react';

const NoData = ({text}: {text?: string}) => {
    return (
        <div className='w-full h-full typo-heading_medium_semibold flex justify-center items-center'>
            {text ?? 'No Items Avaialable'}
        </div>
    );
};

export default NoData;
