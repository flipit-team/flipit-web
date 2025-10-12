import {redirect} from 'next/navigation';
import LiveAuctionDetails from '~/ui/wrappers/LiveAuctionDetails';
import {Item} from '~/utils/interface';
import { getSingleAuctionServerSide } from '~/lib/server-api';
import { AuctionDTO } from '~/types/api';
import { Suspense } from 'react';
import Loading from '~/ui/common/loading/Loading';

type Props = {
    params: Promise<{slug: string}>;
};

// Helper function to transform AuctionDTO to Item interface
function transformAuctionToItem(auction: AuctionDTO): Item {
    return {
        id: auction.item.id,
        title: auction.item.title,
        description: auction.item.description,
        imageUrls: auction.item.imageUrls,
        acceptCash: true, // Auctions typically accept cash
        cashAmount: auction.currentBid || auction.startingBid,
        published: true,
        sold: auction.status === 'ENDED',
        location: auction.item.location,
        condition: auction.item.condition,
        brand: auction.item.brand,
        dateCreated: auction.item.dateCreated,
        promoted: false,
        liked: false,
        seller: {
            ...auction.item.seller as any,
            id: auction.item.seller.id.toString(),
            avgRating: auction.item.seller.avgRating || 0,
            avg_rating: auction.item.seller.avgRating || 0,
            avatar: auction.item.seller.avatar || auction.item.seller.profileImageUrl || '',
            status: auction.item.seller.status || 'Active'
        },
        itemCategory: auction.item.itemCategory,
        // Auction-specific fields
        isAuction: true,
        auctionId: auction.id,
        startingBid: auction.startingBid,
        currentBid: auction.currentBid,
        bidIncrement: auction.bidIncrement,
        reservePrice: auction.reservePrice,
        startDate: auction.startDate,
        endDate: auction.endDate,
        auctionStatus: auction.status,
        biddingsCount: auction.biddingsCount || 0,
        biddings: auction.biddings || []
    };
}

const page = async ({params}: Props) => {
    try {
        const {slug} = await params;


        // Fetch auction data from server
        const result = await getSingleAuctionServerSide(slug);

        if (result.error) {
            redirect('/error-page');
        }

        if (!result.data) {
            redirect('/error-page');
        }

        // Transform auction to item format
        const item = transformAuctionToItem(result.data);


        return (
            <Suspense fallback={<Loading size="md" text="Loading..." />}>
                <LiveAuctionDetails item={item} />
            </Suspense>
        );
    } catch (error) {
        redirect('/error-page');
    }
};

export default page;