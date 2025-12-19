import React from 'react';
import {redirect} from 'next/navigation';
import Image from 'next/image';
import Form from '~/ui/common/auth/form';
import VerifyProfile from '~/ui/common/auth/VerifyProfile';
import ResetPassword from '~/ui/common/auth/ResetPassword';

const Login = async ({searchParams}: {searchParams: Promise<{[key: string]: string | undefined}>}) => {
    try {
        const resolvedSearchParams = await searchParams; // Await the searchParams

        const authValue = resolvedSearchParams.auth; // Now you can access `auth`

        return (
            <div className='flex-1 grid grid-cols-2 xs:grid-cols-1 w-full xs:grid-sizes'>
                <div className='w-[454px] xs:w-full mx-auto overflow-y-auto no-scrollbar'>
                    <div className='flex w-full mt-[46px] xs:justify-center'>
                        <Image
                            src={'/logos/logo-text-cropped.png'}
                            height={35}
                            width={89}
                            alt='Flipit'
                            className='h-[35px] w-[89px]'
                            priority
                        />
                    </div>

                    {authValue === 'verify' ? (
                        <VerifyProfile forVerify={true} />
                    ) : authValue === 'code' ? (
                        <VerifyProfile forVerify={false} />
                    ) : authValue === 'reset' ? (
                        <ResetPassword />
                    ) : (
                        <Form />
                    )}
                </div>
                <div className='h-full bg-primary text-white flex items-center justify-center flex-col xs:hidden'>
                    <Image
                        src={'/auth-banner.png'}
                        height={365}
                        width={365}
                        sizes="365px"
                        priority
                        quality={85}
                        alt='banner'
                        className='h-[365px] w-[365px]'
                    />
                    <h2 className='typo-heading_lb mt-[31px]'>Trade smart, swap easy</h2>
                    <p className='w-[492px] typo-heading_sr text-center  mt-2'>
                        Turn the items you have into the ones you need. Start trading today!
                    </p>
                </div>
            </div>
        );
    } catch {
        redirect('/error-page');
    }
};

export default Login;
