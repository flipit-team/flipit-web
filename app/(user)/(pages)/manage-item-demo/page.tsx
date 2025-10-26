'use client';
import React, { useState } from 'react';
import ManageItemDetail from '~/ui/wrappers/ManageItemDetail';

export default function ManageItemDemoPage() {
    const [viewMode, setViewMode] = useState<'regular' | 'auction'>('regular');

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Toggle Demo Mode */}
            <div className='bg-white border-b border-border_gray py-4 px-[120px] xs:px-4 sticky top-0 z-10'>
                <div className='flex items-center justify-between'>
                    <h1 className='typo-heading_ss'>Demo: Manage Item Page</h1>
                    <div className='flex gap-3'>
                        <button
                            onClick={() => setViewMode('regular')}
                            className={`px-4 py-2 rounded-lg typo-body_lr ${
                                viewMode === 'regular'
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-text_four hover:bg-gray-200'
                            }`}
                        >
                            Regular Item
                        </button>
                        <button
                            onClick={() => setViewMode('auction')}
                            className={`px-4 py-2 rounded-lg typo-body_lr ${
                                viewMode === 'auction'
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-text_four hover:bg-gray-200'
                            }`}
                        >
                            Auction Item
                        </button>
                    </div>
                </div>
            </div>

            <ManageItemDetail isAuction={viewMode === 'auction'} />
        </div>
    );
}
