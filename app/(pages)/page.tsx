import React from 'react';
import {redirect} from 'next/navigation';
import Image from 'next/image';
import Form from '~/ui/common/auth/form';

const Home = async () => {
    try {
        return (
            <div className='flex-1 grid grid-cols-2 xs:grid-cols-1 w-full xs:grid-sizes'>
                <div className='w-[454px] xs:w-full mx-auto overflow-y-auto no-scrollbar'>
                    <div className='typo-heading_small_bold text-primary flex w-full mt-[46px] mb-[90px] xs:mb-0 xs:justify-center'>
                        Flipit
                    </div>
                    <Form />
                </div>
                <div className='h-full bg-primary text-white flex items-center justify-center flex-col xs:hidden'>
                    <Image
                        src={'/auth-banner.png'}
                        height={365}
                        width={365}
                        alt='banner'
                        className='h-[365px] w-[365px]'
                    />
                    <h2 className='typo-heading_large_bold mt-[31px]'>Trade smart, swap easy</h2>
                    <p className='w-[492px] typo-heading_small_regular text-center  mt-2'>
                        Turn the items you have into the ones you need. Start trading today!
                    </p>
                </div>
            </div>
        );
    } catch {
        redirect('/error-page');
    }
};

export default Home;
