'use client';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import React from 'react';
import {useAppContext} from '~/contexts/AppContext';

const SellersInfo = () => {
    const {setShowPopup} = useAppContext();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', 'profile-popup');
    return (
        <div className='flex items-center justify-between'>
            <span className='typo-heading_small_medium'>Seller Information</span>
            <Link
                href={`?${params.toString()}`}
                className='typo-body_medium_regular text-primary underline'
                onClick={() => setShowPopup(true)}
            >
                View Seller Details
            </Link>
        </div>
    );
};

export default SellersInfo;
