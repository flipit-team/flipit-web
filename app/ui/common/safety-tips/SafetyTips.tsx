'use client';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import React from 'react';
import {useAppContext} from '~/contexts/AppContext';

const SafetyTips = () => {
    const {setShowPopup} = useAppContext();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', 'report-issue');
    return (
        <div
            className='border border-dashed border-warning p-4 rounded-md space-y-4 mx-auto bg-surface-primary'
        >
            <h2 className='typo-body_lm text-base text-center'>Safety Tips</h2>
            <ul className='typo-body_mr list-disc list-inside space-y-1'>
                <li>Meet in a public place with good lighting.</li>
                <li>Dont send money or share financial information.</li>
                <li>Inspect items carefully before purchasing.</li>
                <li>Trust your instincts—if something feels off, walk away.</li>
            </ul>

            <hr className='border-t border-dashed border-warning' />

            <Link
                href={`?${params.toString()}`}
                className='block text-warning font-medium cursor-pointer hover:underline text-center'
                onClick={() => setShowPopup(true)}
            >
                Report Abuse
            </Link>
        </div>
    );
};

export default SafetyTips;
