import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import ManageItemDetail from '~/ui/wrappers/ManageItemDetail';
import {API_BASE_PATH} from '~/lib/config';

interface PageProps {
    params: Promise<{id: string}>;
}

async function getItemData(itemId: string, token: string) {
    try {
        const res = await fetch(`${API_BASE_PATH}/items/${itemId}`, {
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
        console.error('Failed to fetch item:', error);
        return null;
    }
}

async function getItemOffers(itemId: string, token: string) {
    try {
        // Fetch both bids (for auctions) and offers (for regular items)
        const [bidsRes, offersRes] = await Promise.all([
            fetch(`${API_BASE_PATH}/bids/item/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                cache: 'no-store'
            }).catch(() => null),
            fetch(`${API_BASE_PATH}/offer/items/${itemId}/offers`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                cache: 'no-store'
            }).catch(() => null)
        ]);

        const extractArray = (data: any) => {
            if (Array.isArray(data)) return data;
            if (data?.content && Array.isArray(data.content)) return data.content;
            return [];
        };

        const bids = bidsRes && bidsRes.ok ? extractArray(await bidsRes.json().catch(() => [])) : [];
        const offers = offersRes && offersRes.ok ? extractArray(await offersRes.json().catch(() => [])) : [];

        return [...bids, ...offers];
    } catch (error) {
        console.error('Failed to fetch offers:', error);
        return [];
    }
}

export default async function ManageItemPage({params}: PageProps) {
    const {id} = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/login');
    }

    const [itemData, offersData] = await Promise.all([getItemData(id, token), getItemOffers(id, token)]);

    if (!itemData) {
        redirect('/');
    }

    return (
        <div className='min-h-screen bg-gray-50 xs:bg-transparent'>
            <ManageItemDetail item={itemData} offers={offersData} />
        </div>
    );
}
