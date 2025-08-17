import MainHome from '~/ui/wrappers/MainHome';
import { Item } from '~/utils/interface';
import { getItemsServerSide, getCategoriesServerSide, checkAuthServerSide } from '~/lib/server-api';
import { ItemDTO } from '~/types/api';

interface SearchParams {
    q?: string;
    size?: string;
    page?: string;
}

// Transform ItemDTO to Item for compatibility with existing components
function transformItems(items: ItemDTO[]): Item[] {
    if (!items || !Array.isArray(items)) {
        return [];
    }
    return items.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrls: item.imageUrls,
        flipForImgUrls: [], // This field doesn't exist in new API
        acceptCash: item.acceptCash,
        cashAmount: item.cashAmount,
        condition: item.condition,
        published: item.published,
        location: item.location,
        dateCreated: new Date(item.dateCreated),
        seller: {
            id: item.seller.id.toString(),
            title: '', // This field doesn't exist in new API
            firstName: item.seller.firstName,
            middleName: '', // This field doesn't exist in new API
            lastName: item.seller.lastName,
            email: item.seller.email,
            phoneNumber: item.seller.phoneNumber,
            avatar: item.seller.profileImageUrl || '',
            avg_rating: item.seller.avgRating || 0,
            status: item.seller.status || 'active',
            phoneNumberVerified: item.seller.phoneNumberVerified || false,
            dateVerified: new Date(item.seller.dateVerified || item.seller.dateCreated),
        },
        itemCategories: item.itemCategories.map(cat => ({
            name: cat.name,
            description: cat.description,
        })),
    }));
}

export default async function Page({searchParams}: {searchParams?: Promise<SearchParams>}) {
    // Check authentication status and log for debugging
    const authStatus = await checkAuthServerSide();
    console.log('🔐 Home page auth status:', authStatus.isAuthenticated ? 'LOGGED IN' : 'NOT LOGGED IN');
    if (authStatus.user) {
        console.log('👤 Current user:', authStatus.user.firstName || authStatus.user.username || authStatus.user.email);
    }

    // Get search parameters
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 0;
    const size = resolvedSearchParams?.size ? parseInt(resolvedSearchParams.size) : 15;
    const query = resolvedSearchParams?.q;

    // Fetch items and categories server-side using updated functions
    const { data: itemsData, error: itemsError } = await getItemsServerSide({ page, size, search: query });
    const { data: categoriesData, error: categoriesError } = await getCategoriesServerSide();
    
    // Transform server data
    const items: Item[] = itemsData?.content ? transformItems(itemsData.content) : [];
    const categories: {name: string; description: string | null}[] = categoriesData ? 
        categoriesData.map(cat => ({ name: cat.name, description: cat.description })) : [];
    
    console.log('🏠 Server-side data fetching complete');
    console.log('🏠 Items loaded:', items.length);
    console.log('🏠 Categories loaded:', categories.length);
    
    if (itemsError) {
        console.error('🏠 Items fetch error:', itemsError);
    }
    if (categoriesError) {
        console.error('🏠 Categories fetch error:', categoriesError);
    }

    return <MainHome items={items} defaultCategories={categories} authStatus={authStatus} />;
}
