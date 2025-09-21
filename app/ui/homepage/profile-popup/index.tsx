'use client';
import Image from 'next/image';
import {useSearchParams} from 'next/navigation';
import React, {useState} from 'react';
import {useAppContext} from '~/contexts/AppContext';
import StarRating from '../../common/star-rating/StarRating';

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
              avgRating?: number;
              status: string;
              phoneNumberVerified: boolean;
              dateVerified: Date;
              reviewCount?: number;
          }
        | undefined;
    onClose: () => void;
    onSubmit: (payload: any) => void;
}
const ProfilePopup = (props: Props) => {
    const {seller, onClose, onSubmit} = props;
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
                        onClick={() => onClose()}
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
                            onClick={() => onClose()}
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
                            <div className='typo-body_lm'>{seller?.firstName + ' ' + seller?.lastName}</div>
                            <div className='h-[23px] w-max px-[2px] bg-surface-primary-16 text-primary  flex items-center justify-center rounded typo-body_mr'>
                                {seller?.dateVerified ? 'Verified profile' : 'Unverified profile'}
                            </div>
                            <div className='flex my-1'>
                                <StarRating 
                                    rating={seller?.avgRating || seller?.avg_rating || 0}
                                    size={20}
                                />
                            </div>
                            <p className='typo-body_mr text-text_four'>Responds within minutes</p>
                            <p className='typo-body_mr text-text_four mb-5'>Joined Flipit in 2024</p>
                            <div
                                onClick={() => setViewPhone(!viewPhone)}
                                className={`w-full flex items-center justify-center h-[51px] bg-surface-primary-16 rounded-lg text-primary typo-body_ls`}
                            >
                                {viewPhone ? seller?.phoneNumber : 'Contact via Phone'}
                            </div>{' '}
                        </div>
                    </div>
                    <div className='mt-[20px] flex flex-col gap-4 xs:px-4'>
                        <div className='typo-body_lm flex '>
                            Verified reviews <p className='text-text-pink'>({seller?.reviewCount || 0})</p>
                        </div>
                        {seller?.reviewCount && seller.reviewCount > 0 ? (
                            <div className='flex flex-col gap-3'>
                                <div className='flex my-1'>
                                    <StarRating
                                        rating={seller?.avgRating || seller?.avg_rating || 0}
                                        size={20}
                                    />
                                </div>
                                <p className='typo-body_mm'>Recent Review</p>
                                <p className='typo-body_sr text-text_three'>Average rating based on {seller.reviewCount} reviews</p>
                                <p className='typo-body_sr text-text_three'>See all reviews below</p>
                            </div>
                        ) : (
                            <div className='flex flex-col gap-3'>
                                <p className='typo-body_sr text-text_three'>No reviews yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
};

export default ProfilePopup;
