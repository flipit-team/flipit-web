import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Loading from '../loading/Loading';

interface Props {
    title: string;
    bg?: boolean;
    icon?: string;
    border?: boolean;
    link?: string;
    isLoading?: boolean;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const AuthButton = (props: Props) => {
    const {bg, title, icon, border, link, isLoading, onClick} = props;
    if (isLoading) {
        return (
            <div className={`w-full h-[45px] ${bg ? 'bg-primary text-white' : 'text-text_four'} ${border ? 'border border-border_gray' : ''} flex items-center justify-center px-4 rounded-[43px] typo-body_ms cursor-default`}>
                <Loading size="sm" variant="spinner" center={false} className={bg ? 'text-white' : 'text-gray-600'} />
            </div>
        );
    }
    if (link) {
        return (
            <Link
                href={link ? link : '/'}
                className={`w-full h-[45px] ${bg ? 'bg-primary text-white' : 'text-text_four'} ${border ? 'border border-border_gray' : ''} flex items-center px-4 rounded-[43px] typo-body_ms cursor-pointer`}
            >
                {icon ? <Image alt='icon' height={24} width={24} src={icon} className='h-6 w-6' /> : <></>}
                <p className='mx-auto'>{title}</p>
            </Link>
        );
    }
    return (
        <div
            onClick={onClick}
            className={`w-full h-[45px] ${bg ? 'bg-primary text-white' : 'text-text_four'} ${border ? 'border border-border_gray' : ''} flex items-center px-4 rounded-[43px] typo-body_ms cursor-pointer`}
        >
            {icon ? <Image alt='icon' height={24} width={24} src={icon} className='h-6 w-6' /> : <></>}
            <p className='mx-auto'>{title}</p>
        </div>
    );
};

export default AuthButton;
