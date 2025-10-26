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
        const res = await fetch(`${API_BASE_PATH}/bids/item/${itemId}`, {
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
        <div className='min-h-screen bg-gray-50'>
            <ManageItemDetail item={itemData} offers={offersData} />
        </div>
    );
}
