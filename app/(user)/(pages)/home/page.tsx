import MainHome from '~/ui/wrappers/MainHome';
import { Item } from '~/utils/interface';
import { getItemsServerSide, getCategoriesServerSide, checkAuthServerSide, getActiveAuctionsServerSide } from '~/lib/server-api';
import { ItemDTO, AuctionDTO } from '~/types/api';

interface SearchParams {
    q?: string;
    size?: string;
    page?: string;
}

// Transform AuctionDTO to Item for compatibility with GridSwiper
function transformAuctionToItem(auction: AuctionDTO): Item {
    return {
        id: auction.item.id,
        title: auction.item.title,
        description: auction.item.description,
        imageUrls: auction.item.imageUrls,
        flipForImgUrls: [], // This field doesn't exist in new API
        acceptCash: true, // Auctions typically accept cash
        cashAmount: auction.currentBid || auction.startingBid,
        condition: auction.item.condition,
        published: true,
        sold: auction.status === 'ENDED',
        location: auction.item.location,
        dateCreated: new Date(auction.item.dateCreated),
        promoted: false,
        liked: false,
        seller: auction.item.seller as any,
        itemCategories: auction.item.itemCategories,
        // Auction-specific fields
        isAuction: true,
        auctionId: auction.id,
        startingBid: auction.startingBid,
        currentBid: auction.currentBid,
        bidIncrement: auction.bidIncrement,
        reservePrice: auction.reservePrice,
        endDate: auction.endDate,
        auctionStatus: auction.status,
        biddingsCount: auction.biddingsCount || 0,
        biddings: auction.biddings || []
    };
}

// Transform ItemDTO to Item for compatibility with existing components
function transformItems(items: ItemDTO[]): Item[] {
    if (!items || !Array.isArray(items)) {
        return [];
    }
    return items.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrls: item.imageUrls,
        flipForImgUrls: [], // This field doesn't exist in new API
        acceptCash: item.acceptCash,
        cashAmount: item.cashAmount,
        condition: item.condition,
        published: item.published,
        location: item.location,
        dateCreated: new Date(item.dateCreated),
        promoted: item.promoted || false,
        liked: item.liked || false,
        seller: {
            id: item.seller.id.toString(),
            title: '', // This field doesn't exist in new API
            firstName: item.seller.firstName,
            middleName: '', // This field doesn't exist in new API
            lastName: item.seller.lastName,
            email: item.seller.email,
            phoneNumber: item.seller.phoneNumber,
            avatar: item.seller.profileImageUrl || '',
            avg_rating: item.seller.avgRating || 0,
            status: item.seller.status || 'active',
            phoneNumberVerified: item.seller.phoneNumberVerified || false,
            idVerified: item.seller.idVerified || false,
            dateVerified: item.seller.dateVerified || item.seller.dateCreated || new Date().toISOString(),
            reviewCount: item.seller.reviewCount || 0,
            mostRecentReview: (item.seller.mostRecentReview || { rating: 0, message: '', userId: 0, postedById: 0, createdDate: new Date().toISOString() }) as any,
        },
        itemCategory: {
            name: item.itemCategory.name,
            description: item.itemCategory.description,
        },
    }));
}

export default async function Page({searchParams}: {searchParams?: Promise<SearchParams>}) {
    // Check authentication status and log for debugging
    const authStatus = await checkAuthServerSide();
    if (authStatus.user) {
    }

    // Get search parameters
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 0;
    const size = resolvedSearchParams?.size ? parseInt(resolvedSearchParams.size) : 15;
    const query = resolvedSearchParams?.q;

    // Fetch items, auctions, and categories server-side using updated functions
    const [
        { data: itemsData, error: itemsError },
        { data: categoriesData, error: categoriesError },
        { data: auctionsData, error: auctionsError }
    ] = await Promise.all([
        getItemsServerSide({ page, size, search: query }),
        getCategoriesServerSide(),
        getActiveAuctionsServerSide(0, 10) // Get first 10 active auctions for swiper
    ]);
    
    // Transform server data
    const items: Item[] = itemsData?.content ? transformItems(itemsData.content) : [];
    const categories: {name: string; description: string | null}[] = categoriesData ? 
        categoriesData.map(cat => ({ name: cat.name, description: cat.description })) : [];
    const auctionItems: Item[] = auctionsData ? auctionsData.map(transformAuctionToItem) : [];
    
    
    if (itemsError) {
    }
    if (categoriesError) {
    }
    if (auctionsError) {
    }

    return <MainHome items={items} auctionItems={auctionItems} defaultCategories={categories} authStatus={authStatus} />;
}
