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

    const [auctionData, bidsData, userData] = await Promise.all([
        getAuctionData(id, token),
        getAuctionBids(id, token),
        getCurrentUser(token)
    ]);

    if (!auctionData) {
        redirect('/');
    }

    // Determine if current user is the owner
    const isOwner = userData && auctionData.item?.seller?.id === userData.id;

    return (
        <div className='min-h-screen bg-gray-50'>
            <ManageAuctionDetail auction={auctionData} bids={bidsData} isOwner={isOwner} />
        </div>
    );
}
