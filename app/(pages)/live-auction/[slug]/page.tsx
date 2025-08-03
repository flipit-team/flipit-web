import {redirect} from 'next/navigation';
import LiveAuctionDetails from '~/ui/wrappers/LiveAuctionDetails';
import {Item} from '~/utils/interface';

type Props = {
    params: Promise<{slug: string}>;
};

const page = async ({params}: Props) => {
    try {
        const {slug} = await params;

        console.log('Live-auction item page - slug:', slug);

        // Using the same API endpoint for now, you mentioned you'll change it later
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/items/get-item?id=${slug}`, {
            cache: 'no-store'
        });

        console.log('Live-auction item page - API response status:', res.status);

        const data: Item = await res.json();

        if (!res.ok) {
            console.error('Live-auction item page - API error:', data);
            redirect('/error-page');
        }

        return <LiveAuctionDetails item={data} />;
    } catch (error) {
        console.error('Live-auction item page - Error:', error);
        redirect('/error-page');
    }
};

export default page;