import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import Offers from '~/ui/wrappers/Offers';
import {API_BASE_PATH} from '~/lib/config';

async function fetchOffers(userId: string, token: string, direction: 'sent' | 'received') {
    try {
        const res = await fetch(`${API_BASE_PATH}/offer/user/${userId}/${direction}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
}

async function fetchUserBids(token: string) {
    try {
        const res = await fetch(`${API_BASE_PATH}/bidding/user/me`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
}

export default async function OffersPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const userId = cookieStore.get('userId')?.value;

    if (!token || !userId) {
        redirect('/login');
    }

    const [sentOffers, receivedOffers, userBids] = await Promise.all([
        fetchOffers(userId, token, 'sent'),
        fetchOffers(userId, token, 'received'),
        fetchUserBids(token),
    ]);

    return <Offers sentOffers={sentOffers} receivedOffers={receivedOffers} currentUserId={Number(userId)} userBids={userBids} />;
}
