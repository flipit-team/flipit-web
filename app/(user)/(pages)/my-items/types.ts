export interface MyItem {
    id: number;
    title: string;
    image: string;
    amount: number;
    views: number;
    type: 'auction' | 'listed' | 'deactivated';
    isAuction?: boolean;
    auctionActive?: boolean;
}

export type TabType = 'auction' | 'listed' | 'deactivated';

export interface Tab {
    id: TabType;
    label: string;
}