import { MyItem, TabType } from '../types';

export const mockItems: Record<TabType, MyItem[]> = {
    auction: [
        {
            id: 1,
            title: 'Canon EOS RP Camera +Small Rig | Clean U...',
            image: '/placeholder-product.svg',
            amount: 1300000,
            views: 30,
            type: 'auction',
            isAuction: true,
            auctionActive: false,
            auctionStatus: 'closed_failed',
            currentBid: 1300000,
        },
        {
            id: 2,
            title: 'Canon EOS RP Camera +Small Rig | Clean U...',
            image: '/placeholder-product.svg',
            amount: 1300000,
            views: 30,
            type: 'auction',
            isAuction: true,
            auctionActive: true,
            auctionStatus: 'active',
            auctionEndDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
            currentBid: 1300000,
        },
        {
            id: 3,
            title: 'Canon EOS RP Camera +Small Rig | Clean U...',
            image: '/placeholder-product.svg',
            amount: 1300000,
            views: 30,
            type: 'auction',
            isAuction: true,
            auctionActive: false,
            auctionStatus: 'closed_successful',
            currentBid: 1300000,
        }
    ],
    listed: [
        {
            id: 4,
            title: 'Canon EOS RP Camera +Small Rig | Clean U...',
            image: '/placeholder-product.svg',
            amount: 1300000,
            views: 30,
            type: 'listed',
            tradeType: 'cash',
        },
        {
            id: 5,
            title: 'Canon EOS RP Camera +Small Rig | Clean U...',
            image: '/placeholder-product.svg',
            amount: 0,
            views: 30,
            type: 'listed',
            tradeType: 'swap',
            swapCategory: 'Gadgets',
        },
        {
            id: 6,
            title: 'Canon EOS RP Camera +Small Rig | Clean U...',
            image: '/placeholder-product.svg',
            amount: 600000,
            views: 30,
            type: 'listed',
            tradeType: 'mixed',
            swapCategory: 'Gadgets',
        }
    ],
    deactivated: [
        {
            id: 7,
            title: 'Canon EOS RP Camera +Small Rig | Clean U...',
            image: '/placeholder-product.svg',
            amount: 1300000,
            views: 30,
            type: 'deactivated',
            isAuction: true,
            currentBid: 1300000,
        },
        {
            id: 8,
            title: 'Canon EOS RP Camera +Small Rig | Clean U...',
            image: '/placeholder-product.svg',
            amount: 0,
            views: 30,
            type: 'deactivated',
            tradeType: 'swap',
            swapCategory: 'Gadgets',
        }
    ]
};
