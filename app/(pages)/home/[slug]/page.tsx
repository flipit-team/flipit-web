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
    };
}

const page = async ({ params }: Props) => {
    try {
        const { slug } = await params;
        
        console.log('🔍 Item detail page - item ID:', slug);
        
        // Get item from server-side using direct backend call
        const { data: itemData, error } = await getSingleItemServerSide(slug);
        
        if (error) {
            console.error('🔍 Error fetching item:', error);
            redirect('/error-page');
        }
        
        if (!itemData) {
            console.log('🔍 Item not found:', slug);
            redirect('/error-page');
        }
        
        // Transform item to legacy format for Home component
        const transformedItem = transformItem(itemData);
        
        console.log('🔍 Item detail loaded:', {
            itemId: slug,
            title: transformedItem.title,
            seller: `${transformedItem.seller.firstName} ${transformedItem.seller.lastName}`
        });
        
        return <ItemDetail item={transformedItem} />;
        
    } catch (error) {
        console.error('🔍 Item detail page error:', error);
        redirect('/error-page');
    }
};

export default page;
