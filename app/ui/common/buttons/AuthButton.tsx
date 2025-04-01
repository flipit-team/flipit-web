import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
    title: string;
    bg?: boolean;
    icon?: string;
    border?: boolean;
    link?: string;
}
const AuthButton = (props: Props) => {
    const {bg, title, icon, border, link} = props;
    return (
        <Link
            href={link ? link : '/home'}
            className={`w-full h-[45px] ${bg ? 'bg-primary text-white' : 'text-text_four'} ${border ? 'border border-border_gray' : ''} flex items-center px-4 rounded-[43px] typo-body_medium_semibold cursor-pointer`}
        >
            {icon ? <Image alt='icon' height={24} width={24} src={icon} className='h-6 w-6' /> : <></>}
            <p className='mx-auto'>{title}</p>
        </Link>
    );
};

export default AuthButton;
