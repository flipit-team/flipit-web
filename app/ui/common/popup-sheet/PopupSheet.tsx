'use client';
import Image from 'next/image';
import React from 'react';
import {useAppContext} from '~/contexts/AppContext';

interface Props {
    children: React.ReactNode;
}

const PopupSheet = (props: Props) => {
    const {showPopup} = useAppContext();
    return (
        <div
            className={`fixed h-[100vh] w-full top-0 bg-background-overlay flex flex-col items-center justify-center left-[0px] z-[1000] transition-transform transform duration-300 origin-top ${
                showPopup ? 'scale-y-100' : 'scale-y-0'
            }`}
        >
            {props.children}
            {/* <div>
                <Image
                    src={'/cancel.svg'}
                    height={13}
                    width={13}
                    alt='bell'
                    className='h-[13px] w-[13px] m'
                    onClick={() => props.setShowFlyout(false)}
                />
                {props.children}
            </div> */}
        </div>
    );
};

export default PopupSheet;
