import Image from 'next/image';
import React from 'react';
import Form from '~/ui/common/auth/Form';

const Auth = () => {
    return (
        <div className='flex-1 grid grid-cols-2 w-full'>
            <div className='w-[454px] mx-auto my-auto'>
                <h1 className='typo-heading_small_bold text-primary fixed top-[47px] xs:text-center'>Flipit</h1>
                <Form />
            </div>
            <div className='bg-primary text-white flex items-center justify-center flex-col xs:hidden'>
                <Image src={'/auth-banner.png'} height={365} width={365} alt='banner' />
                <h2 className='typo-heading_large_bold mt-[31px]'>Trade smart, swap easy</h2>
                <p className='w-[492px] typo-heading_small_regular text-center  mt-2'>
                    Turn the items you have into the ones you need. Start trading today!
                </p>
            </div>
        </div>
    );
};

export default Auth;
