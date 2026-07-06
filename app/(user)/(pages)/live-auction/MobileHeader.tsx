'use client';

import {useRouter} from 'next/navigation';
import {ChevronLeft} from 'lucide-react';

const LiveAuctionMobileHeader = () => {
    const router = useRouter();

    return (
        <div className='hidden xs:flex items-center gap-3 px-4 pt-4 mb-2'>
            <button onClick={() => router.back()} className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center'>
                <ChevronLeft size={20} />
            </button>
            <h1 className='font-poppins typo-heading-md-semibold text-text_one'>Live Auction</h1>
        </div>
    );
};

export default LiveAuctionMobileHeader;
