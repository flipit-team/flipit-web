'use client';
import Image from 'next/image';
import {Bid} from '~/utils/interface';
import NoData from '../common/no-data/NoData';
import {formatToNaira} from '~/utils/helpers';
import { useUserBids } from '~/hooks/useBidding';
import { BidDTO } from '~/types/api';
import Loader from '../common/loader/Loader';

interface Props {
    bids?: Bid[] | null;
    fallbackToApi?: boolean;
}

const CurrentBids = (props: Props) => {
    const { bids: propsBids, fallbackToApi = true } = props;
    
    // Only use API hook if fallbackToApi is true and no bids provided
    const shouldUseFallback = fallbackToApi && !propsBids;
    const { bids: apiBids, loading, error } = useUserBids(undefined, !shouldUseFallback);
    
    // Transform BidDTO to Bid for compatibility
    const transformBids = (bids: BidDTO[]): Bid[] => {
        return bids.map(bid => ({
            id: bid.id,
            withCash: true, // Assuming cash is involved
            cashAmount: bid.bidAmount,
            status: bid.status,
            sentBy: {
                id: bid.bidder.id,
                title: '', // This field doesn't exist in new API
                firstName: bid.bidder.firstName,
                middleName: '', // This field doesn't exist in new API
                lastName: bid.bidder.lastName,
                email: bid.bidder.email,
                phoneNumber: bid.bidder.phone || '',
                avatar: bid.bidder.profileImageUrl || '',
                avg_rating: bid.bidder.avgRating || 0,
                status: bid.bidder.status || 'active',
                phoneNumberVerified: bid.bidder.phoneNumberVerified || false,
                dateVerified: new Date(bid.bidder.dateVerified || bid.bidder.dateCreated),
                dateCreated: new Date(bid.bidder.dateCreated),
            },
            // Note: We need auction item info which isn't directly available in BidDTO
            // This would require additional API calls or restructuring
            auctionItem: {
                id: bid.auctionId,
                title: `Auction Item ${bid.auctionId}`, // Placeholder
                description: '',
                imageUrls: ['/camera.png'], // Placeholder
                flipForImgUrls: ['/camera.png'], // Placeholder to match expected type
                acceptCash: true,
                cashAmount: 0,
                published: true,
                location: '',
                condition: 'good',
                dateCreated: new Date(bid.dateCreated),
                seller: {
                    id: bid.bidder.id,
                    title: '',
                    firstName: bid.bidder.firstName,
                    middleName: '',
                    lastName: bid.bidder.lastName,
                    email: bid.bidder.email,
                    phoneNumber: bid.bidder.phone || '',
                    avatar: bid.bidder.profileImageUrl || '',
                    avg_rating: bid.bidder.avgRating || 0,
                    status: bid.bidder.status || 'active',
                    phoneNumberVerified: bid.bidder.phoneNumberVerified || false,
                    dateVerified: new Date(bid.bidder.dateVerified || bid.bidder.dateCreated),
                    dateCreated: new Date(bid.bidder.dateCreated),
                },
                itemCategories: [{name: 'General', description: 'General category'}],
            },
            offeredItem: {
                id: 0,
                title: 'Cash Bid',
                description: 'Cash bid for auction',
                imageUrls: ['/camera.png'],
                flipForImgUrls: ['/camera.png'],
                acceptCash: true,
                cashAmount: bid.bidAmount,
                published: true,
                location: '',
                condition: 'new',
                dateCreated: new Date(bid.dateCreated),
                seller: {
                    id: bid.bidder.id,
                    title: '',
                    firstName: bid.bidder.firstName,
                    middleName: '',
                    lastName: bid.bidder.lastName,
                    email: bid.bidder.email,
                    phoneNumber: bid.bidder.phone || '',
                    avatar: bid.bidder.profileImageUrl || '',
                    avg_rating: bid.bidder.avgRating || 0,
                    status: bid.bidder.status || 'active',
                    phoneNumberVerified: bid.bidder.phoneNumberVerified || false,
                    dateVerified: new Date(bid.bidder.dateVerified || bid.bidder.dateCreated),
                    dateCreated: new Date(bid.bidder.dateCreated),
                },
                itemCategories: [{name: 'Cash', description: 'Cash bid'}],
            },
            dateCreated: new Date(bid.dateCreated),
        }));
    };
    
    const bids = propsBids || (fallbackToApi ? transformBids(apiBids) : null);

    if (loading) {
        return (
            <div className='mx-[120px] xs:mx-0 my-6 xs:my-0'>
                <h1 className='typo-heading_ms my-6 xs:mx-4'>Current Bids</h1>
                <div className='flex justify-center py-8'>
                    <Loader color="purple" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='mx-[120px] xs:mx-0 my-6 xs:my-0'>
                <h1 className='typo-heading_ms my-6 xs:mx-4'>Current Bids</h1>
                <div className='text-center py-8 text-red-600'>
                    Error loading bids: {error}
                </div>
            </div>
        );
    }

    return (
        <div className='mx-[120px] xs:mx-0 my-6 xs:my-0'>
            <h1 className='typo-heading_ms my-6 xs:mx-4'>Current Bids</h1>
            {bids?.length ? (
                <div className='shadow-[0px_4px_10px_rgba(0,0,0,0.2)] xs:shadow-transparent flex flex-col gap-6 p-8 xs:p-4'>
                    {bids?.map((bid, i) => {
                        return (
                            <div
                                key={i}
                                className='flex items-center border border-border_gray rounded-lg w-[672px] xs:w-full p-3'
                            >
                                <Image
                                    src={'/camera.png'}
                                    height={64}
                                    width={64}
                                    alt='camera'
                                    className='mr-[18px] rounded h-[64px] w-[64px] xs:h-[73px] xs:w-[73px]'
                                />
                                <div>
                                    <div className='flex items-center'>
                                        <p className='text-primary typo-body_ls xs:typo-body_ms'>
                                            {bid?.auctionItem?.title}
                                        </p>
                                        <span className='xs:hidden py-1 px-2 text-[#e40808] typo-body_sr bg-[rgba(228,8,8,0.18)] rounded ml-4'>
                                            {bid.status}
                                        </span>
                                    </div>
                                    <p className='typo-body_mr xs:typo-body_mr text-text_one'>
                                        Your bid:&nbsp;{' '}
                                        {`${bid?.offeredItem?.title ?? ''} ${bid?.offeredItem && bid?.cashAmount ? '+' : ''} ${formatToNaira(bid?.cashAmount)}`}
                                    </p>
                                    <span className='hidden w-max xs:flex py-1 px-2 text-[#e40808] typo-body_sr bg-[rgba(228,8,8,0.18)] rounded'>
                                        {bid.status}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <NoData />
            )}
        </div>
    );
};

export default CurrentBids;
