import LiveAuctionWrapper from '~/ui/wrappers/LiveAuctionWrapper';
import {Item} from '~/utils/interface';
import { getActiveAuctionsServerSide, getCategoriesServerSide } from '~/lib/server-api';
import { AuctionDTO } from '~/types/api';
import { Suspense } from 'react';

interface SearchParams {
    sort?: string;
    category?: string;
    page?: string;
}

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
        seller: auction.item.seller,
        itemCategories: auction.item.itemCategories,
        // Auction-specific fields
        isAuction: true,
        auctionId: auction.id,
        startingBid: auction.startingBid,
        currentBid: auction.currentBid,
        bidIncrement: auction.bidIncrement,
        reservePrice: auction.reservePrice,
        endDate: auction.endDate,
        auctionStatus: auction.status
    };
}

export default async function Page({searchParams}: {searchParams?: Promise<SearchParams>}) {
    try {
        const resolvedSearchParams = await searchParams;
        const page = parseInt(resolvedSearchParams?.page || '0');
        

        // Fetch active auctions and categories in parallel
        const [auctionsResult, categoriesResult] = await Promise.all([
            getActiveAuctionsServerSide(page, 15),
            getCategoriesServerSide()
        ]);

        if (auctionsResult.error) {
        }

        if (categoriesResult.error) {
        }

        // Transform auctions to items format
        const auctions = auctionsResult.data || [];
        const transformedItems: Item[] = auctions.map(transformAuctionToItem);
        
        const categories = categoriesResult.data || [];


        return (
            <Suspense fallback={<div>Loading auctions...</div>}>
                <LiveAuctionWrapper items={transformedItems} defaultCategories={categories} />
            </Suspense>
        );
    } catch (error) {
        // Fallback to empty data if there's an error
        return (
            <Suspense fallback={<div>Loading auctions...</div>}>
                <LiveAuctionWrapper items={[]} defaultCategories={[]} />
            </Suspense>
        );
    }
}
