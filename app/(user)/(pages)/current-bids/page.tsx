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


        // Check if user is authenticated
        if (!userId || !token) {
            redirect('/signin');
        }

        
        const apiUrl = `${API_BASE_URL}/offer/user/${userId}/offers`;
        
        const res = await fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            cache: 'no-store'
        });


        if (!res.ok) {
            const errorData = await res.json();
            return <NoData text={`Error loading bids: ${errorData.error || 'Failed to fetch bids'}`} />;
        }

        const data: Bid[] = await res.json();
        return <CurrentBids bids={data} fallbackToApi={false} />;
    } catch (error) {
        redirect('/error-page');
    }
};

export default page;
