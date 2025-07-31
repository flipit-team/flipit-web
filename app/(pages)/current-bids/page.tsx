import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import NoData from '~/ui/common/no-data/NoData';
import CurrentBids from '~/ui/wrappers/CurrentBids';
import {Bid} from '~/utils/interface';

const page = async () => {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('userId')?.value;
        const token = cookieStore.get('token')?.value;

        console.log('Current-bids page - userId:', userId);
        console.log('Current-bids page - token exists:', !!token);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bids/get-user-bids?userId=${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}; userId=${userId}`
            },
            cache: 'no-store'
        });

        console.log('Current-bids page - API response status:', res.status);

        const data: Bid[] = await res.json();

        if (!res.ok) {
            console.error('Current-bids page - API error:', data);
            return <NoData text='Failed to fetch bids' />;
        }
        return <CurrentBids bids={data} />;
    } catch (error) {
        console.error('Current-bids page - Error:', error);
        redirect('/error-page');
    }
};

export default page;
