'use client';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import React from 'react';
import {useAppContext} from '~/contexts/AppContext';
import Loading from '../loading/Loading';

interface Props {
    isLight?: boolean;
    text: string;
    slug?: string;
    usePopup?: boolean;
    isLoading?: boolean;
    disabled?: boolean;
    action?: () => void;
}

const RegularButton = ({isLight, text, slug, usePopup, isLoading, disabled, action}: Props) => {
    const {setShowPopup} = useAppContext();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', slug ?? '');

    if (isLoading) {
        return (
            <div className={`w-full flex items-center justify-center h-[51px] ${isLight ? 'bg-surface-primary-16' : 'bg-primary'} rounded-lg`}>
                <Loading size="sm" variant="spinner" center={false} className={isLight ? 'text-primary' : 'text-white'} />
            </div>
        );
    }

    if (action) {
        return (
            <div
                onClick={disabled ? () => {} : action}
                className={`w-full flex items-center justify-center h-[51px] ${isLight ? 'bg-surface-primary-16' : 'bg-primary'} rounded-lg ${isLight ? 'text-primary' : 'text-white'} typo-body_ls ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
                {text}
            </div>
        );
    }

    return (
        <Link
            href={`?${params.toString()}`}
            onClick={usePopup ? () => setShowPopup(true) : () => {}}
            className={`w-full flex items-center justify-center h-[51px] ${isLight ? 'bg-surface-primary-16' : 'bg-primary'} rounded-lg ${isLight ? 'text-primary' : 'text-white'} typo-body_ls cursor-pointer`}
        >
            {text}
        </Link>
    );
};

export default RegularButton;
