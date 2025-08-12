import LiveAuctionWrapper from '~/ui/wrappers/LiveAuctionWrapper';
import {Item} from '~/utils/interface';

interface SearchParams {
    sort?: string;
    category?: string;
    page?: string;
}

export default async function Page({searchParams}: {searchParams?: Promise<SearchParams>}) {
    // Always provide empty data to server-side rendering
    // Client-side components will decide whether to use API data or dummy data based on debug mode
    const data: Item[] = [];
    const categories: {name: string; description: string | null}[] = [];

    return <LiveAuctionWrapper items={data} defaultCategories={categories} />;
}
