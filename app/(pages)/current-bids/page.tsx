import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import NoData from '~/ui/common/no-data/NoData';
import CurrentBids from '~/ui/wrappers/CurrentBids';
import {Bid} from '~/utils/interface';
import { API_BASE_URL } from '~/lib/config';

const page = async () => {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('userId')?.value;
        const token = cookieStore.get('token')?.value;

        console.log('Current-bids page - userId:', userId);
        console.log('Current-bids page - token exists:', !!token);
        console.log('Current-bids page - all cookies:', Object.fromEntries(cookieStore.getAll().map(c => [c.name, c.value])));

        // Check if user is authenticated
        if (!userId || !token) {
            console.log('Current-bids page - User not authenticated, redirecting to login');
            redirect('/signin');
        }

        console.log('Current-bids page - Making direct backend API call with userId:', userId);
        
        const apiUrl = `${API_BASE_URL}/offer/user/${userId}/offers`;
        console.log('Current-bids page - Backend API URL:', apiUrl);
        
        const res = await fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            cache: 'no-store'
        });

        console.log('Current-bids page - API response status:', res.status);

        if (!res.ok) {
            const errorData = await res.json();
            console.error('Current-bids page - API error:', errorData);
            return <NoData text={`Error loading bids: ${errorData.error || 'Failed to fetch bids'}`} />;
        }

        const data: Bid[] = await res.json();
        console.log('Current-bids page - Fetched bids:', data.length);
        return <CurrentBids bids={data} fallbackToApi={false} />;
    } catch (error) {
        console.error('Current-bids page - Error:', error);
        redirect('/error-page');
    }
};

export default page;
