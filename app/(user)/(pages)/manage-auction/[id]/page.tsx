import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import ManageAuctionDetail from '~/ui/wrappers/ManageAuctionDetail';
import {API_BASE_PATH} from '~/lib/config';

interface PageProps {
    params: Promise<{id: string}>;
}

async function getAuctionData(auctionId: string, token: string) {
    try {
        const res = await fetch(`${API_BASE_PATH}/auction/${auctionId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            return null;
        }

        return await res.json();
    } catch (error) {
        console.error('Failed to fetch auction:', error);
        return null;
    }
}

async function getAuctionBids(auctionId: string, token: string) {
    try {
        const res = await fetch(`${API_BASE_PATH}/bidding/auction/${auctionId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            return [];
        }

        return await res.json();
    } catch (error) {
        console.error('Failed to fetch bids:', error);
        return [];
    }
}

async function getCurrentUser(token: string) {
    try {
        const res = await fetch(`${API_BASE_PATH}/user/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            return null;
        }

        return await res.json();
    } catch (error) {
        console.error('Failed to fetch user:', error);
        return null;
    }
}

export default async function ManageAuctionPage({params}: PageProps) {
    const {id} = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/login');
    }

    const [rawAuction, rawBids, userData] = await Promise.all([
        getAuctionData(id, token),
        getAuctionBids(id, token),
        getCurrentUser(token)
    ]);

    if (!rawAuction) {
        redirect('/');
    }

    // Determine if current user is the owner
    const isOwner = !!(userData && rawAuction.item?.seller?.id === userData.id);

    // Transform AuctionDTO → AuctionData shape expected by ManageAuctionDetail
    const auctionData = {
        id: rawAuction.id,
        title: rawAuction.item?.title || '',
        description: rawAuction.item?.description || '',
        imageUrls: rawAuction.item?.imageUrls || [],
        condition: rawAuction.item?.condition || '',
        brand: rawAuction.item?.brand || '',
        location: rawAuction.item?.location || '',
        category: rawAuction.item?.itemCategory?.name || '',
        subcategory: rawAuction.item?.subcategory?.name || '',
        dateCreated: rawAuction.item?.dateCreated || '',
        promoted: rawAuction.item?.promoted || false,
        views: rawAuction.item?.viewsCount || 0,
        startingBid: rawAuction.startingBid,
        currentBid: rawAuction.currentBid,
        bidIncrement: rawAuction.bidIncrement,
        reservePrice: rawAuction.reservePrice,
        startDate: rawAuction.startDate,
        endDate: rawAuction.endDate,
        status: rawAuction.status,
        totalBids: rawAuction.biddingsCount || 0,
        uniqueBidders: 0,
        auctioneer: {
            id: rawAuction.item?.seller?.id || 0,
            name: `${rawAuction.item?.seller?.firstName || ''} ${rawAuction.item?.seller?.lastName || ''}`.trim() || 'Seller',
            avatar: rawAuction.item?.seller?.avatar || '/images/placeholders/placeholder-avatar.svg',
            rating: rawAuction.item?.seller?.avgRating || 0,
            verified: !!rawAuction.item?.seller?.dateVerified,
            joinedDate: rawAuction.item?.seller?.dateCreated || '',
            responseTime: 'N/A',
            totalSales: rawAuction.item?.seller?.reviewCount || 0,
        },
    };

    // Transform BiddingDTO[] → Bid[] shape expected by ManageAuctionDetail
    const bidsArray = Array.isArray(rawBids) ? rawBids : (rawBids?.content || []);
    const maxBidAmount = bidsArray.length > 0 ? Math.max(...bidsArray.map((b: any) => b.amount || 0)) : 0;
    const bidsData = bidsArray.map((bid: any, index: number) => ({
        id: bid.id || index + 1,
        bidder: {
            id: bid.bidder?.id || 0,
            name: `${bid.bidder?.firstName || ''} ${bid.bidder?.lastName || ''}`.trim() || 'Anonymous',
            avatar: bid.bidder?.avatar || '/images/placeholders/placeholder-avatar.svg',
            rating: bid.bidder?.avgRating || 0,
            verified: !!bid.bidder?.dateVerified,
            joinedDate: bid.bidder?.dateCreated || '',
        },
        amount: bid.amount,
        bidTime: bid.bidTime,
        isWinning: bid.amount === maxBidAmount && maxBidAmount > 0,
    }));

    return (
        <div className='min-h-screen bg-gray-50'>
            <ManageAuctionDetail auction={auctionData} bids={bidsData} isOwner={isOwner} />
        </div>
    );
}
