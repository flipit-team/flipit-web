import Image from 'next/image';
import React from 'react';
import UsedBadge from '~/ui/common/badges/UsedBadge';
import RegularButton from '~/ui/common/buttons/RegularButton';
import PopupSheet from '~/ui/common/popup-sheet/PopupSheet';
import MakeAnOffer from '~/ui/homepage/make-an-offer';
import ProfilePopup from '~/ui/homepage/profile-popup';
import SellersInfo from '~/ui/homepage/sellers-info';

const page = () => {
    return (
        <>
            <div className='grid-sizes grid grid-cols-[712px_1fr] xs:grid-cols-1 gap-6 h-full mt-10 xs:mb-6'>
                <div className='p-6 xs:p-0'>
                    <Image
                        src={'/camera-large.png'}
                        height={443}
                        width={712}
                        alt='picture'
                        className='h-[443px] w-[712px] xs:w-full xs:h-[222px] mb-6'
                    />
                    <div className='grid grid-cols-3 gap-6'>
                        <Image
                            src={'/camera-large.png'}
                            height={150}
                            width={222}
                            alt='picture'
                            className='h-[150px] w-[222px] xs:h-[76px] xs:w-[112px]'
                        />{' '}
                        <Image
                            src={'/camera-large.png'}
                            height={150}
                            width={222}
                            alt='picture'
                            className='h-[150px] w-[222px] xs:h-[76px] xs:w-[112px]'
                        />{' '}
                        <Image
                            src={'/camera-large.png'}
                            height={150}
                            width={222}
                            alt='picture'
                            className='h-[150px] w-[222px] xs:h-[76px] xs:w-[112px]'
                        />
                    </div>
                </div>
                <div className='p-6 xs:p-0'>
                    <UsedBadge text='Fairly Used' />
                    <div className='typo-heading_medium_semibold xs:typo-heading_small_semibold text-text_one mt-[10px]'>
                        Canon EOS RP Camera +Small Rig{' '}
                    </div>
                    <p className='typo-heading_small_medium text-primary xs:typo-body_medium_medium xs:mb-1'>
                        ₦1,300,000
                    </p>
                    <p className='typo-body_medium_regular text-text_four mb-[42px]'>Posted 3 weeks ago</p>
                    <RegularButton text='Make an offer' slug='make-an-offer' usePopup />
                    <div className='h-6'></div>
                    <RegularButton text='Buy right away' isLight />
                    <div className='typo-body_large_medium text-text_one mt-6'>Details</div>
                    <p className='typo-body_medium_regular text-text_one mt-2 mb-4'>
                        High ergonomic gaming chair and table, all components are of the highest specifications in the
                        industry and comply with European and American standards and SGS certification. Using
                        super-resistant foam sponge, wear-resistant PU leather show more
                    </p>
                    <div className='typo-body_medium_medium text-text_one'>Location</div>
                    <div className='typo-body_medium_regular text-text_four mb-8'>Lagos, Nigeria</div>
                    <SellersInfo />
                    <div className='flex mb-4'>
                        <Image
                            src={'/camera-large.png'}
                            height={52}
                            width={52}
                            alt='picture'
                            className='h-[52px] w-[52px] rounded-full'
                        />
                        <div className='w-full ml-2'>
                            <div className='typo-body_large_medium'>Emmanuel Christian</div>
                            <div className='h-[23px] w-max px-[2px] bg-[#005f7329] text-primary  flex items-center justify-center rounded typo-body_small_regular'>
                                Verified profile
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
                                            className='h-[20px] w-[20px] rounded-full'
                                        />
                                    );
                                })}
                            </div>
                            <p className='typo-body_small_regular text-text_four'>Responds within minutes</p>
                            <p className='typo-body_small_regular text-text_four'>Joined Flipit in 2024</p>
                        </div>
                    </div>
                    <RegularButton text='Contact via Phone' isLight />
                </div>
            </div>
            <PopupSheet>
                <ProfilePopup />
                <MakeAnOffer />
            </PopupSheet>
        </>
    );
};

export default page;
