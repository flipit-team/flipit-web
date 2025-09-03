'use client';
import React from 'react';
import {ChevronDown} from 'lucide-react';
import Link from 'next/link';

interface Bid {
    bidderName: string;
    timeAgo: string;
    amount: number;
}

interface BidHistoryProps {
    bids: Bid[];
    totalBids: number;
    bidderCount: number;
    itemId?: string;
    className?: string;
}

const BidHistory = ({bids, totalBids, bidderCount, itemId, className = ''}: BidHistoryProps) => {
    const formatCurrency = (amount: number) => {
        return `₦${amount.toLocaleString()}`;
    };

    return (
        <div className={`${className}`}>
            <div
                className='px-4 py-3 rounded-lg border border-primary mb-4 bg-surface-primary'
            >
                <p className='typo-body_mr text-center text-text_one'>{bidderCount} people have bid on this item</p>
            </div>

            <div className='max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
                {bids.map((bid, index) => (
                    <div
                        key={index}
                        className='grid grid-cols-3 gap-4 py-3 border-b border-border_gray last:border-b-0'
                    >
                        <div className='typo-body_mr text-text_one'>{bid.bidderName}</div>
                        <div className='typo-body_mr text-text_four'>{bid.timeAgo}</div>
                        <div className='typo-body_mr text-text_one'>{formatCurrency(bid.amount)}</div>
                    </div>
                ))}
            </div>

            <Link
                href={`/live-auction/${itemId}/bids`}
                className='flex items-center gap-1 pt-4 mt-4 text-primary cursor-pointer hover:text-primary transition-colors'
            >
                <span className='typo-body_mr'>See all bids ({totalBids})</span>
                <ChevronDown className='w-4 h-4' />
            </Link>
        </div>
    );
};

export default BidHistory;
