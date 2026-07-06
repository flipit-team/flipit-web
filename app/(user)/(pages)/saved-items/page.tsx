'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {ChevronLeft} from 'lucide-react';
import SavedItemsGrid from '~/ui/common/saved-items-grid/SavedItemsGrid';
import NoData from '~/ui/common/no-data/NoData';

type SavedTab = 'listed' | 'auction';

const SavedItemsPage = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<SavedTab>('listed');

    return (
        <div className='xs:bg-[#FFFFF0] xs:min-h-screen xs:pb-24'>
            {/* Mobile header - hidden on desktop */}
            <div className='hidden xs:flex items-center justify-between px-4 py-3 bg-[#FFFFF0]'>
                <button
                    onClick={() => router.back()}
                    className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center'
                >
                    <ChevronLeft size={20} />
                </button>
                <h1 className='typo-body_lb'>Saved Items</h1>
                <div className='w-10' />
            </div>

            {/* Desktop heading */}
            <h1 className='typo-heading_ms my-6 xs:hidden'>Saved Items</h1>

            {/* Desktop tab bar - hidden on mobile */}
            <div className='flex border-b border-border_gray mb-6 xs:hidden'>
                <button
                    onClick={() => setActiveTab('listed')}
                    className={`px-6 py-3 font-poppins typo-body-md-semibold ${
                        activeTab === 'listed'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-text_four'
                    }`}
                >
                    Listed Items
                </button>
                <button
                    onClick={() => setActiveTab('auction')}
                    className={`px-6 py-3 font-poppins typo-body-md-semibold ${
                        activeTab === 'auction'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-text_four'
                    }`}
                >
                    Live Auctions
                </button>
                <button
                    className='px-6 py-3 text-text_four font-poppins typo-body-md-semibold'
                >
                    Bids
                </button>
            </div>

            {/* Mobile tab pills - hidden on desktop */}
            <div className='hidden xs:flex gap-3 px-4 pb-3'>
                <button
                    onClick={() => setActiveTab('listed')}
                    className={`flex-1 py-2.5 rounded-full typo-body_mr text-center transition-colors ${
                        activeTab === 'listed'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-text_two'
                    }`}
                >
                    Listed Items
                </button>
                <button
                    onClick={() => setActiveTab('auction')}
                    className={`flex-1 py-2.5 rounded-full typo-body_mr text-center transition-colors ${
                        activeTab === 'auction'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-text_two'
                    }`}
                >
                    Auction Items
                </button>
            </div>

            {/* Listed items tab (always visible on desktop, toggled on mobile) */}
            {activeTab === 'listed' && (
                <div className='xs:[&>div]:pr-0 xs:[&>div]:px-4 xs:[&>div>div:first-child]:hidden'>
                    <SavedItemsGrid />
                </div>
            )}

            {/* Auction items tab (mobile only) */}
            {activeTab === 'auction' && (
                <div className='hidden xs:block'>
                    <NoData text='No saved auction items yet' />
                </div>
            )}

            {/* Desktop always shows SavedItemsGrid when auction tab is active on mobile
                This ensures desktop never loses the grid */}
            {activeTab === 'auction' && (
                <div className='xs:hidden'>
                    <SavedItemsGrid />
                </div>
            )}
        </div>
    );
};

export default SavedItemsPage;
