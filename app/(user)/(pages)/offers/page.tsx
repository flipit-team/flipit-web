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
        const data = await res.json();
        // Handle both plain array and paginated wrapper {content: [...]}
        if (Array.isArray(data)) return data;
        if (data?.content && Array.isArray(data.content)) return data.content;
        return [];
    } catch {
        return [];
    }
}

async function enrichWithImages(offers: any[], token: string) {
    // Only fetch items where imageUrls is missing — backend now includes them in OfferDTO
    const itemIds = Array.from(new Set(
        offers
            .filter((o: any) => !o.item?.imageUrls?.length)
            .map((o: any) => o.item?.id)
            .filter(Boolean)
    )) as number[];

    const itemMap: Record<number, string[]> = {};

    if (itemIds.length > 0) {
        await Promise.all(itemIds.map(async (id) => {
            try {
                const res = await fetch(`${API_BASE_PATH}/items/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    cache: 'no-store',
                });
                if (res.ok) {
                    const item = await res.json();
                    itemMap[id] = item.imageUrls || [];
                }
            } catch {}
        }));
    }

    return offers.map(offer => ({
        ...offer,
        item: {
            ...offer.item,
            imageUrls: offer.item?.imageUrls?.length
                ? offer.item.imageUrls
                : (itemMap[offer.item?.id] ?? []),
        },
    }));
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
        const data = await res.json();
        if (Array.isArray(data)) return data;
        if (data?.content && Array.isArray(data.content)) return data.content;
        return [];
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

    const [rawSent, rawReceived, userBids] = await Promise.all([
        fetchOffers(userId, token, 'sent'),
        fetchOffers(userId, token, 'received'),
        fetchUserBids(token),
    ]);

    const [sentOffers, receivedOffers] = await Promise.all([
        enrichWithImages(rawSent, token),
        enrichWithImages(rawReceived, token),
    ]);

    return <Offers sentOffers={sentOffers} receivedOffers={receivedOffers} currentUserId={Number(userId)} userBids={userBids} />;
}
