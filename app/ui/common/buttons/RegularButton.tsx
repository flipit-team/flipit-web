'use client';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import React from 'react';
import {useAppContext} from '~/contexts/AppContext';
import Loader from '../loader/Loader';

interface Props {
    isLight?: boolean;
    text: string;
    slug?: string;
    usePopup?: boolean;
    isLoading?: boolean;
    action?: () => void;
}

const RegularButton = ({isLight, text, slug, usePopup, isLoading, action}: Props) => {
    const {setShowPopup} = useAppContext();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', slug ?? '');

    if (isLoading) {
        return <Loader color='green' />;
    }

    if (action) {
        return (
            <div
                onClick={action}
                className={`w-full flex items-center justify-center h-[51px] ${isLight ? 'bg-[#005f7329]' : 'bg-primary'} rounded-lg ${isLight ? 'text-primary' : 'text-white'} typo-body_large_semibold`}
            >
                {text}
            </div>
        );
    }

    return (
        <Link
            href={`?${params.toString()}`}
            onClick={usePopup ? () => setShowPopup(true) : () => {}}
            className={`w-full flex items-center justify-center h-[51px] ${isLight ? 'bg-[#005f7329]' : 'bg-primary'} rounded-lg ${isLight ? 'text-primary' : 'text-white'} typo-body_large_semibold`}
        >
            {text}
        </Link>
    );
};

export default RegularButton;
