import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import TransactionHubV2 from '~/ui/wrappers/TransactionHubV2';
import {TransactionDTO} from '~/types/transaction';

interface PageProps {
    params: Promise<{id: string}>;
    searchParams: Promise<{type?: string}>;
}

async function getTransactionData(transactionId: string, type?: string): Promise<TransactionDTO> {
    // TODO: Replace with actual API call when backend is ready
    // For now, return dummy data based on type parameter

    await new Promise(resolve => setTimeout(resolve, 100));

    const baseDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();

    // Common user data
    const seller = {
        id: 1,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah@example.com',
        phoneNumber: '+234 801 234 5678',
        avatar: '/placeholder-avatar.svg',
        avgRating: 4.8,
        reviewCount: 45,
        phoneNumberVerified: true,
        dateVerified: baseDate,
        dateCreated: baseDate
    };

    const buyer = {
        id: 101,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '+234 802 345 6789',
        avatar: '/placeholder-avatar.svg',
        avgRating: 4.5,
        reviewCount: 23,
        phoneNumberVerified: true,
        dateVerified: baseDate,
        dateCreated: baseDate
    };

    const sellerItem = {
        id: 1,
        title: 'iPhone 13 Pro Max 256GB - Pacific Blue',
        description: 'Excellent condition iPhone 13 Pro Max. Barely used, comes with original box and accessories.',
        imageUrls: ['/placeholder-product.svg', '/placeholder-product.svg'],
        acceptCash: true,
        cashAmount: 850000,
        published: true,
        sold: true,
        promoted: false,
        liked: false,
        location: 'Lagos, Nigeria',
        condition: 'Like New',
        brand: 'Apple',
        dateCreated: baseDate,
        seller: seller,
        itemCategory: {
            id: 1,
            name: 'Electronics',
            description: 'Electronic devices'
        }
    };

    // Return different dummy data based on type
    if (type === 'exchange') {
        return {
            id: parseInt(transactionId),
            transactionType: 'ITEM_EXCHANGE' as const,
            status: 'SHIPPING_PENDING' as const,
            seller,
            buyer,
            sellerItem,
            buyerItem: {
                id: 2,
                title: 'MacBook Air M1 2020 - Space Gray',
                description: 'Perfect condition MacBook Air with M1 chip. Upgraded to newer model.',
                imageUrls: ['/placeholder-product.svg'],
                acceptCash: false,
                cashAmount: 0,
                published: true,
                sold: true,
                promoted: false,
                liked: false,
                location: 'Abuja, Nigeria',
                condition: 'Excellent',
                brand: 'Apple',
                dateCreated: baseDate,
                seller: buyer,
                itemCategory: {
                    id: 1,
                    name: 'Electronics',
                    description: 'Electronic devices'
                }
            },
            totalValue: 850000,
            offerId: 2,
            timeline: [
                {
                    id: 1,
                    transactionId: parseInt(transactionId),
                    status: 'OFFER_ACCEPTED' as const,
                    title: 'Exchange Offer Accepted',
                    description: 'Both parties agreed to exchange items',
                    dateCreated: baseDate
                }
            ],
            dateCreated: baseDate,
            dateUpdated: new Date().toISOString()
        };
    }

    if (type === 'exchange-cash') {
        return {
            id: parseInt(transactionId),
            transactionType: 'ITEM_PLUS_CASH' as const,
            status: 'PAYMENT_PENDING' as const,
            seller,
            buyer,
            sellerItem,
            buyerItem: {
                id: 3,
                title: 'iPad Pro 11" M2 256GB',
                description: 'Latest iPad Pro with M2 chip. Perfect for creative work.',
                imageUrls: ['/placeholder-product.svg'],
                acceptCash: true,
                cashAmount: 600000,
                published: true,
                sold: true,
                promoted: false,
                liked: false,
                location: 'Port Harcourt, Nigeria',
                condition: 'Brand New',
                brand: 'Apple',
                dateCreated: baseDate,
                seller: buyer,
                itemCategory: {
                    id: 1,
                    name: 'Electronics',
                    description: 'Electronic devices'
                }
            },
            cashAmount: 250000,
            totalValue: 850000,
            offerId: 3,
            timeline: [
                {
                    id: 1,
                    transactionId: parseInt(transactionId),
                    status: 'OFFER_ACCEPTED' as const,
                    title: 'Exchange + Cash Offer Accepted',
                    description: 'Exchange agreed with ₦250,000 cash difference',
                    dateCreated: baseDate
                }
            ],
            dateCreated: baseDate,
            dateUpdated: new Date().toISOString()
        };
    }

    if (type === 'auction') {
        return {
            id: parseInt(transactionId),
            transactionType: 'AUCTION_WIN' as const,
            status: 'PAYMENT_PENDING' as const,
            seller,
            buyer,
            sellerItem: {
                ...sellerItem,
                title: 'iPhone 13 Pro Max 256GB - Pacific Blue (Auction)',
                description:
                    'Excellent condition iPhone 13 Pro Max. Won at auction. Payment deadline: 4 days from auction end.'
            },
            cashAmount: 800000,
            totalValue: 800000,
            auctionId: 1,
            bidId: 15,
            timeline: [
                {
                    id: 1,
                    transactionId: parseInt(transactionId),
                    status: 'OFFER_ACCEPTED' as const,
                    title: 'Auction Won',
                    description: 'You won the auction with a bid of ₦800,000',
                    dateCreated: baseDate,
                    metadata: {
                        winningBid: 800000,
                        totalBids: 15
                    }
                }
            ],
            dateCreated: baseDate,
            dateUpdated: new Date().toISOString()
        };
    }

    // Default: CASH_ONLY
    return {
        id: parseInt(transactionId),
        transactionType: 'CASH_ONLY' as const,
        status: 'OFFER_ACCEPTED' as const,
        seller,
        buyer,
        sellerItem,
        cashAmount: 800000,
        totalValue: 800000,
        offerId: 1,
        timeline: [
            {
                id: 1,
                transactionId: parseInt(transactionId),
                status: 'OFFER_ACCEPTED' as const,
                title: 'Offer Accepted',
                description: 'Seller accepted your purchase offer',
                dateCreated: baseDate
            }
        ],
        dateCreated: baseDate,
        dateUpdated: new Date().toISOString()
    };
}

export default async function TransactionPage({params, searchParams}: PageProps) {
    const {id} = await params;
    const {type} = await searchParams;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/login');
    }

    // Get dummy data based on type parameter
    const transactionData = await getTransactionData(id, type);

    return (
        <div className='min-h-screen bg-gray-50'>
            <TransactionHubV2 transaction={transactionData} />
        </div>
    );
}
