'use client';
import Image from 'next/image';
import {useSearchParams} from 'next/navigation';
import React, {useState} from 'react';
import {useAppContext} from '~/contexts/AppContext';

interface Props {
    seller:
        | {
              title: string;
              firstName: string;
              middleName: string;
              lastName: string;
              email: string;
              phoneNumber: string;
              avatar: string;
              avg_rating: number;
              status: string;
              phoneNumberVerified: boolean;
              dateVerified: Date;
          }
        | undefined;
}
const ProfilePopup = (props: Props) => {
    const {seller} = props;
    const [viewPhone, setViewPhone] = useState(false);
    const {setShowPopup} = useAppContext();
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    if (query === 'profile-popup')
        return (
            <div className='w-full flex flex-col justify-center items-center xs:px-4'>
                <div className='w-[708px] xs:hidden'>
                    <Image
                        src={'/close-white.svg'}
                        height={45}
                        width={45}
                        alt='bell'
                        className='h-[45px] w-[45px] ml-auto'
                        onClick={() => setShowPopup(false)}
                    />
                </div>
                <div className='h-[648px] w-[708px] bg-white rounded-lg p-[30px] xs:p-0 xs:h-max xs:w-full xs:py-[32px]'>
                    <div className='hidden xs:block'>
                        <Image
                            src={'/cancel.svg'}
                            height={16}
                            width={16}
                            alt='bell'
                            className='h-[16px] w-[16px] ml-auto mr-4'
                            onClick={() => setShowPopup(false)}
                        />
                    </div>
                    <div className='flex xs:flex-col xs:items-center mb-4 border-b border-border_gray pb-[20px] xs:px-4'>
                        <Image
                            src={'/camera-large.png'}
                            height={194}
                            width={194}
                            alt='picture'
                            className='h-[194px] w-[194px] rounded-full'
                        />
                        <div className='w-full ml-[36px] xs:ml-0 xs:flex xs:flex-col xs:items-center mt-4'>
                            <div className='typo-body_large_medium'>{seller?.firstName + ' ' + seller?.lastName}</div>
                            <div className='h-[23px] w-max px-[2px] bg-[#005f7329] text-primary  flex items-center justify-center rounded typo-body_medium_regular'>
                                {seller?.dateVerified ? 'Verified profile' : 'Unverified profile'}
                            </div>
                            <div className='flex my-1'>
                                {Array.from('11111').map((item, i) => {
                                    return (
                                        <Image
                                            key={i}
                                            src={'/full-star.svg'}
                                            height={20}
                                            width={20}
                                            alt='picture'
                                            className='h-[20px] w-[20px]'
                                        />
                                    );
                                })}
                            </div>
                            <p className='typo-body_medium_regular text-text_four'>Responds within minutes</p>
                            <p className='typo-body_medium_regular text-text_four mb-5'>Joined Flipit in 2024</p>
                            <div
                                onClick={() => setViewPhone(!viewPhone)}
                                className={`w-full flex items-center justify-center h-[51px] bg-[#005f7329] rounded-lg text-primary typo-body_large_semibold`}
                            >
                                {viewPhone ? seller?.phoneNumber : 'Contact via Phone'}
                            </div>{' '}
                        </div>
                    </div>
                    <div className='mt-[20px] flex flex-col gap-4 xs:px-4'>
                        <div className='typo-body_large_medium flex '>
                            Verified reviews <p className='text-[#d7b0b0]'>(2)</p>
                        </div>
                        <div className='flex flex-col gap-3'>
                            <div className='flex my-1'>
                                {Array.from('11111').map((item, i) => {
                                    return (
                                        <Image
                                            key={i}
                                            src={'/full-star.svg'}
                                            height={20}
                                            width={20}
                                            alt='picture'
                                            className='h-[20px] w-[20px]'
                                        />
                                    );
                                })}
                            </div>
                            <p className='typo-body_medium_medium'>Good Product</p>
                            <p className='typo-body_small_regular text-[#666666]'>More than what I expected</p>
                            <p className='typo-body_small_regular text-[#666666]'>by Collins</p>
                        </div>
                    </div>
                </div>
            </div>
        );
};

export default ProfilePopup;
