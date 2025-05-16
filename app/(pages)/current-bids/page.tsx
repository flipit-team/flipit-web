import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import NoData from '~/ui/common/no-data/NoData';
import CurrentBids from '~/ui/wrappers/CurrentBids';
import {Bid} from '~/utils/interface';

const page = async () => {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('userId')?.value;

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bids/get-user-bids?userId=${userId}`, {
            cache: 'no-store'
        });

        const data: Bid[] = await res.json();

        if (!res.ok) {
            return <NoData text='Failed to fetch items' />;
        }
        return <CurrentBids bids={data} />;
    } catch {
        redirect('/error-page');
    }
};

export default page;
