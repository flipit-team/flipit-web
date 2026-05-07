import React from 'react';
import {redirect} from 'next/navigation';
import Image from 'next/image';
import Form from '~/ui/common/auth/form';
import VerifyProfile from '~/ui/common/auth/VerifyProfile';
import ResetPassword from '~/ui/common/auth/ResetPassword';

const Login = async ({searchParams}: {searchParams: Promise<{[key: string]: string | undefined}>}) => {
    try {
        const resolvedSearchParams = await searchParams;
        const authValue = resolvedSearchParams.auth;

        return (
            <div className='flex-1 grid grid-cols-2 xs:grid-cols-1 w-full xs:grid-sizes h-screen'>
                <div className='xs:w-full xs:px-6 overflow-y-auto no-scrollbar flex flex-col items-center justify-center h-full'>
                    <div className='w-[468px] xs:w-full'>
                        {/* Logo */}
                        <div className='flex items-center gap-0 xs:justify-center'>
                            <Image
                                src={'/images/auth/logo-icon.png'}
                                height={80}
                                width={159}
                                alt='Flipit Logo'
                                className='h-[80px] w-[159px] -ml-[43px] xs:ml-0'
                                priority
                            />
                        </div>
                        <div className='-mt-[12px] -ml-[26px] xs:ml-0 xs:flex xs:justify-center'>
                            <Image
                                src={'/images/auth/brand-name-tag.png'}
                                height={55}
                                width={130}
                                alt='Flipit'
                                className='h-[55px] w-[130px] object-contain'
                                priority
                            />
                        </div>

                        {/* Form */}
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
                </div>
                <div className='h-full bg-primary text-white flex flex-col items-center justify-center rounded-l-[70px] overflow-hidden xs:hidden'>
                    <div>
                        <Image
                            src={'/images/auth/auth-illustration.svg'}
                            height={700}
                            width={500}
                            priority
                            alt='E-commerce illustration'
                            className='w-[500px] h-[700px]'
                        />
                    </div>
                    <div className='w-[492px] mt-[4px]'>
                        <h2 className='font-poppins font-bold text-[32px] leading-[1.6] text-right'>
                            Trade Freely. Connect Simply
                        </h2>
                        <p className='font-poppins font-normal text-[20px] leading-[1.6] text-center mt-1'>
                            Turn the items you have into the ones you need. Start trading today!
                        </p>
                    </div>
                </div>
            </div>
        );
    } catch {
        redirect('/error-page');
    }
};

export default Login;
