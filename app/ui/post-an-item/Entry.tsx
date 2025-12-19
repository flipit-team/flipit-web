'use client';
import React from 'react';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import GoBack from '../common/go-back';

interface SellOptionCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onContinue: () => void;
}

const SellOptionCard: React.FC<SellOptionCardProps> = ({icon, title, description, onContinue}) => {
    return (
        <div className='bg-surface-primary rounded-lg p-6 xs:p-4 flex flex-col items-center text-center'>
            <div className='mb-4 xs:mb-3 text-primary'>{icon}</div>
            <h3 className='typo-heading_ss xs:typo-heading_sr mb-3 xs:mb-2'>{title}</h3>
            <p className='typo-body_lr xs:typo-body_sr text-text_three mb-6 xs:mb-4 max-w-xs xs:max-w-none px-2'>{description}</p>
            <button
                onClick={onContinue}
                className='typo-body_ms xs:typo-body_sr w-full max-w-xs xs:max-w-none py-3 xs:py-2.5 px-6 xs:px-4 border border-primary text-primary
                   rounded-lg hover:bg-primary/10 hover:text-primary-light hover:border-primary-light transition-colors'
            >
                Continue
            </button>
        </div>
    );
};

const PostItemPage: React.FC = () => {
    const router = useRouter();
    const handleAuctionContinue = () => {
        // Navigate to auction form
        router.push('/post-an-item/form?type=auction');
    };

    const handleListedContinue = () => {
        // Handle navigation to listed item flow
        router.push('/post-an-item/form');
    };

    const HammerIcon = () => (
        <Image src='/gavel-large.svg' alt='hammer' width={75} height={75} className='w-[75px] h-[75px] xs:w-[60px] xs:h-[60px]' />
    );

    const PriceTagIcon = () => (
        <Image src='/listed.svg' alt='price tag' width={75} height={75} className='w-[75px] h-[75px] xs:w-[60px] xs:h-[60px]' />
    );

    return (
        <div className='min-h-screen bg-white'>
            <div className='max-w-6xl mx-auto px-4 xs:px-3 py-8 xs:py-4'>
                {/* Back button */}
                <GoBack />

                {/* Main content with shadow */}
                <div className='shadow-lg w-[866px] xs:w-full mx-auto mt-10 xs:mt-6 rounded-lg p-8 xs:p-4'>
                    {/* Title section */}
                    <div className='text-center mb-12 xs:mb-8'>
                        <h1 className='typo-heading_ms xs:typo-heading_sr mb-3 xs:mb-2'>Post an Item</h1>
                        <p className='typo-body_lr xs:typo-body_sr text-text_three px-4 xs:px-0'>Choose how you&apos;d like to sell your item</p>
                    </div>

                    {/* Options - Mobile: vertical stack with auction first, Desktop: grid */}
                    <div className='grid md:grid-cols-2 xs:grid-cols-1 gap-8 xs:gap-4 max-w-[640px] xs:max-w-none mx-auto'>
                        {/* Auction Item - Always first */}
                        <SellOptionCard
                            icon={<HammerIcon />}
                            title='Auction Item'
                            description='Start bidding and let buyers compete.'
                            onContinue={handleAuctionContinue}
                        />

                        {/* Listed Item - Second on mobile, side-by-side on desktop */}
                        <SellOptionCard
                            icon={<PriceTagIcon />}
                            title='Listed Item'
                            description='Set a fixed price for quick sales.'
                            onContinue={handleListedContinue}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostItemPage;
