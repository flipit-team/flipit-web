import {redirect} from 'next/navigation';
import Home from '~/ui/wrappers/Home';
// import {dummyItems} from '~/utils/dummy';
import {Item} from '~/utils/interface';

const page = async ({params}: {params: {slug: string}}) => {
    try {
        const {slug} = await params;

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/items/get-item?id=${slug}`, {
            cache: 'no-store'
        });
        const data: Item = await res.json();

        return <Home item={data} />;
    } catch {
        redirect('/error-page');
    }
};

export default page;
