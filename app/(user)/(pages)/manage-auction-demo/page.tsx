'use client';
import React, { useState, Suspense } from 'react';
import ManageAuctionDetail from '~/ui/wrappers/ManageAuctionDetail';

function ManageAuctionContent() {
    const [viewMode, setViewMode] = useState<'owner' | 'bidder'>('owner');

    return (
        <>
            {/* Toggle Demo Mode */}
            <div className='bg-white border-b border-border_gray py-4 px-[120px] xs:px-4 sticky top-0 z-10'>
                <div className='flex items-center justify-between'>
                    <h1 className='typo-heading_ss'>Demo: Manage Auction Page</h1>
                    <div className='flex gap-3'>
                        <button
                            onClick={() => setViewMode('owner')}
                            className={`px-4 py-2 rounded-lg typo-body_lr ${
                                viewMode === 'owner'
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-text_four hover:bg-gray-200'
                            }`}
                        >
                            Owner View
                        </button>
                        <button
                            onClick={() => setViewMode('bidder')}
                            className={`px-4 py-2 rounded-lg typo-body_lr ${
                                viewMode === 'bidder'
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-text_four hover:bg-gray-200'
                            }`}
                        >
                            Bidder View
                        </button>
                    </div>
                </div>
            </div>

            <ManageAuctionDetail isOwner={viewMode === 'owner'} />
        </>
    );
}

export default function ManageAuctionDemoPage() {
    return (
        <div className='min-h-screen bg-gray-50'>
            <Suspense fallback={<div>Loading...</div>}>
                <ManageAuctionContent />
            </Suspense>
        </div>
    );
}
