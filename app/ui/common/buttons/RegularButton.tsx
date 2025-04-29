'use client';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import React from 'react';
import {useAppContext} from '~/contexts/AppContext';
import dynamic from 'next/dynamic';

interface Props {
    isLight?: boolean;
    text: string;
    slug?: string;
    usePopup?: boolean;
    isLoading?: boolean;
    disabled?: boolean;
    action?: () => void;
}

const Loader = dynamic(() => import('../loader/Loader'), {ssr: false});

const RegularButton = ({isLight, text, slug, usePopup, isLoading, disabled, action}: Props) => {
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
                onClick={disabled ? () => {} : action}
                className={`w-full flex items-center justify-center h-[51px] ${isLight ? 'bg-[#005f7329]' : 'bg-primary'} rounded-lg ${isLight ? 'text-primary' : 'text-white'} typo-body_large_semibold cursor-pointer`}
            >
                {disabled ? 'wait...' : text}
            </div>
        );
    }

    return (
        <Link
            href={`?${params.toString()}`}
            onClick={usePopup ? () => setShowPopup(true) : () => {}}
            className={`w-full flex items-center justify-center h-[51px] ${isLight ? 'bg-[#005f7329]' : 'bg-primary'} rounded-lg ${isLight ? 'text-primary' : 'text-white'} typo-body_large_semibold cursor-pointer`}
        >
            {text}
        </Link>
    );
};

export default RegularButton;
