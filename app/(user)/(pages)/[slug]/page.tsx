import { redirect } from 'next/navigation';
import ItemDetail from '~/ui/wrappers/ItemDetail';
import { getSingleItemServerSide } from '~/lib/server-api';
import { Item } from '~/utils/interface';
import { ItemDTO } from '~/types/api';

type Props = {
    params: Promise<{slug: string}>;
};

// Transform ItemDTO to Item for compatibility with existing Home component
function transformItem(item: ItemDTO): Item {
    return {
        id: item.id,
        title: item.title || '',
        description: item.description || '',
        imageUrls: item.imageUrls || [],
        flipForImgUrls: [], // This field doesn't exist in new API
        acceptCash: item.acceptCash || false,
        cashAmount: item.cashAmount || 0,
        condition: item.condition || '',
        published: item.published || false,
        location: item.location || '',
        dateCreated: item.dateCreated ? new Date(item.dateCreated) : new Date(),
        promoted: item.promoted || false,
        liked: item.liked || false,
        seller: {
            id: item.seller?.id?.toString() || '',
            title: '', // This field doesn't exist in new API
            firstName: item.seller?.firstName || '',
            middleName: '', // This field doesn't exist in new API
            lastName: item.seller?.lastName || '',
            email: item.seller?.email || '',
            phoneNumber: item.seller?.phoneNumber || '',
            avatar: item.seller?.profileImageUrl || '',
            avg_rating: item.seller?.avgRating || 0,
            status: item.seller?.status || 'active',
            phoneNumberVerified: item.seller?.phoneNumberVerified || false,
            idVerified: item.seller?.idVerified || false,
            dateVerified: item.seller?.dateVerified || item.seller?.dateCreated || new Date().toISOString(),
            reviewCount: item.seller?.reviewCount || 0,
            mostRecentReview: (item.seller?.mostRecentReview || { rating: 0, message: '', userId: 0, postedById: 0, createdDate: new Date().toISOString() }) as any,
        },
        itemCategory: {
            name: item.itemCategory?.name || '',
            description: item.itemCategory?.description || '',
        },
    };
}

const page = async ({ params }: Props) => {
    try {
        const { slug } = await params;

        // Validate slug
        if (!slug || slug === 'undefined' || slug === 'null') {
            console.error('Invalid slug:', slug);
            redirect('/error-page');
        }

        // Get item from server-side using direct backend call
        const { data: itemData, error } = await getSingleItemServerSide(slug);

        if (error) {
            console.error('Error fetching item:', error);
            redirect('/error-page');
        }

        if (!itemData) {
            console.error('No item data returned for slug:', slug);
            redirect('/error-page');
        }

        // Transform item to legacy format for Home component
        const transformedItem = transformItem(itemData);

        return <ItemDetail item={transformedItem} />;

    } catch (error) {
        console.error('Error in item details page:', error);
        redirect('/error-page');
    }
};

export default page;
