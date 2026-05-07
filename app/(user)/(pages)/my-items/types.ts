export interface MyItem {
    id: number;
    title: string;
    image: string;
    amount: number;
    views: number;
    type: 'auction' | 'listed' | 'deactivated';
    isAuction?: boolean;
    auctionActive?: boolean;
    auctionStatus?: 'active' | 'closed_successful' | 'closed_failed';
    auctionEndDate?: string;
    currentBid?: number;
    tradeType?: 'cash' | 'swap' | 'mixed';
    swapCategory?: string;
}

export type TabType = 'auction' | 'listed' | 'deactivated';

export interface Tab {
    id: TabType;
    label: string;
}