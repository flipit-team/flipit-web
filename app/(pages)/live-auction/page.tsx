import {redirect} from 'next/navigation';
import LiveAuctionWrapper from '~/ui/wrappers/LiveAuctionWrapper';
import {dummyItems} from '~/utils/dummy';
import {Item} from '~/utils/interface';

interface SearchParams {
    sort?: string;
    category?: string;
    page?: string;
}

export default async function Page({searchParams}: {searchParams?: Promise<SearchParams>}) {
    try {
        // Await the searchParams promise
        const resolvedSearchParams = searchParams ? await searchParams : {};

        // const sort = resolvedSearchParams?.sort ?? 'alphabetical';
        // const category = resolvedSearchParams?.category ?? '';
        const page = resolvedSearchParams?.page ?? '0';

        // For now, using dummy data. Replace with actual auction API call
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/items/get-items?page=${page}`,
            // `${process.env.NEXT_PUBLIC_BASE_URL}/api/items/get-items?page=${page}&sort=${sort}&category=${encodeURIComponent(category)}`,

            {
                cache: 'no-store'
            }
        ).catch(() => null);

        // Fallback to dummy data if API fails
        const data: Item[] = res ? await res.json() : dummyItems;

        const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/items/get-categories`, {
            cache: 'no-store'
        }).catch(() => null);

        const categories = categoriesRes ? await categoriesRes.json() : [];

        return <LiveAuctionWrapper items={data} defaultCategories={categories} />;
    } catch {
        redirect('/error-page');
    }
}
