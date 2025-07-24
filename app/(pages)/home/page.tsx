import {redirect} from 'next/navigation';
import NoData from '~/ui/common/no-data/NoData';
import MainHome from '~/ui/wrappers/MainHome';
// import {dummyItems} from '~/utils/dummy';
import {Item} from '~/utils/interface';

interface SearchParams {
    q?: string;
    size?: string;
    page?: string;
}

export default async function Page({searchParams}: {searchParams?: Promise<SearchParams>}) {
    try {
        // Await the searchParams promise
        const resolvedSearchParams = searchParams ? await searchParams : {};

        const size = resolvedSearchParams?.size ?? '10';
        const page = resolvedSearchParams?.page ?? '0';
        const query = resolvedSearchParams?.q ?? '';

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/items/get-items?page=${page}&size=${size}&q=${encodeURIComponent(query)}`,
            {
                cache: 'no-store'
            }
        );

        const data: Item[] = await res.json();

        const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/items/get-categories`, {
            cache: 'no-store'
        });

        const categories = await categoriesRes.json();

        if (!res.ok) {
            return <NoData text='Failed to fetch items' />;
        }

        return <MainHome items={data} defaultCategories={categories} />;
    } catch {
        redirect('/error-page');
    }
}
