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
        <div className='bg-[#005f730d] rounded-lg p-8 flex flex-col items-center text-center'>
            <div className='mb-6 text-primary'>{icon}</div>
            <h3 className='typo-heading_ss mb-4'>{title}</h3>
            <p className='typo-body_lr text-text_three mb-8 max-w-xs'>{description}</p>
            <button
                onClick={onContinue}
                className='typo-body_ms w-full max-w-xs py-3 px-6 border border-primary text-primary 
                   rounded-lg hover:bg-primary/10 transition-colors'
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
        <Image src='/gavel-large.svg' alt='hammer' width={75} height={75} className='w-[75px h-[75px' />
    );

    const PriceTagIcon = () => (
        <Image src='/listed.svg' alt='price tag' width={75} height={75} className='w-[75px h-[75px' />
    );

    return (
        <div className='min-h-screen bg-white'>
            <div className='max-w-6xl mx-auto px-4 py-8'>
                {/* Back button */}
                <GoBack />

                {/* Main content with shadow */}
                <div className='shadow-[0px_4px_10px_rgba(0,0,0,0.2)] w-[866px] mx-auto mt-10 rounded-lg p-8'>
                    {/* Title section */}
                    <div className='text-center mb-12'>
                        <h1 className='typo-heading_ms mb-3'>Post an Item</h1>
                        <p className='typo-body_lr text-text_three'>Choose how you&apos;d like to sell your item</p>
                    </div>

                    {/* Options grid */}
                    <div className='grid md:grid-cols-2 gap-8 max-w-[640px] mx-auto'>
                        <SellOptionCard
                            icon={<HammerIcon />}
                            title='Auction Item'
                            description='Start bidding and let buyers compete.'
                            onContinue={handleAuctionContinue}
                        />

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
