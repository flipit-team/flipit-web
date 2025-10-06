// New ReviewDTO interface
export interface ReviewDTO {
    rating: number;        // 1-5 star rating
    message: string;       // Review text
    userId: number;        // User being reviewed
    postedById: number;    // User who posted review
    createdDate: string;   // ISO date
}

export interface Item {
    id: number;
    title: string;
    description: string;
    imageUrls: string[];
    flipForImgUrls?: string[];
    acceptCash: boolean;
    cashAmount: number;
    condition: string | null;
    published: boolean;
    sold?: boolean;
    location: string;
    brand?: string;
    dateCreated: Date | string;
    promoted: boolean;        // NEW: Item promotion status
    liked: boolean;          // NEW: Whether current user liked this item
    seller: {
        id: string | number;
        title?: string;
        firstName: string;
        middleName?: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        avatar?: string;
        profileImageUrl?: string;
        avg_rating?: number;
        avgRating?: number;
        status?: string;
        phoneNumberVerified: boolean;  // NEW: Enhanced seller verification (for verified profile)
        idVerified?: boolean;         // NEW: ID document verification (for verified ID badge)
        dateVerified: string;         // NEW: Verification date
        dateCreated?: string;
        reviewCount: number;         // Enhanced review count
        mostRecentReview: ReviewDTO; // Latest review
    };
    itemCategory: {
        id?: number;
        name: string;
        description: string;
    };
    // Auction-specific fields (optional)
    isAuction?: boolean;
    auctionId?: number;
    startingBid?: number;
    currentBid?: number;
    bidIncrement?: number;
    reservePrice?: number;
    startDate?: string;
    endDate?: string;
    auctionStatus?: string;
    biddingsCount?: number;
    biddings?: {
        auctionId: number;
        bidder: {
            id: number;
            title?: string;
            firstName: string;
            middleName?: string;
            lastName: string;
            email: string;
            phoneNumber: string;
            avatar?: string;
            avgRating?: number;
            reviewCount?: number;
            status?: string;
            phoneNumberVerified?: boolean;
            dateVerified?: string;
            dateCreated?: string;
        };
        amount: number;
        bidTime: string;
    }[];
}

export interface Bid {
    id: number;
    withCash: boolean;
    cashAmount: number;
    status: string;
    sentBy: {
        id: number;
        title: string;
        firstName: string;
        middleName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        avatar: string;
        avg_rating: number;
        status: string;
        phoneNumberVerified: boolean;
        dateVerified: Date;
        dateCreated: Date;
    };
    auctionItem: {
        id: number;
        title: string;
        description: string;
        imageUrls: [string];
        flipForImgUrls: [string];
        acceptCash: boolean;
        cashAmount: number;
        published: boolean;
        location: string;
        condition: string;
        dateCreated: Date;
        seller: {
            id: number;
            title: string;
            firstName: string;
            middleName: string;
            lastName: string;
            email: string;
            phoneNumber: string;
            avatar: string;
            avg_rating: number;
            status: string;
            phoneNumberVerified: boolean;
            dateVerified: Date;
            dateCreated: Date;
        };
        itemCategories: [
            {
                name: string;
                description: string;
            }
        ];
    };
    offeredItem: {
        id: number;
        title: string;
        description: string;
        imageUrls: [string];
        flipForImgUrls: [string];
        acceptCash: boolean;
        cashAmount: number;
        published: boolean;
        location: string;
        condition: string;
        dateCreated: Date;
        seller: {
            id: number;
            title: string;
            firstName: string;
            middleName: string;
            lastName: string;
            email: string;
            phoneNumber: string;
            avatar: string;
            avg_rating: number;
            status: string;
            phoneNumberVerified: boolean;
            dateVerified: Date;
            dateCreated: Date;
        };
        itemCategories: [
            {
                name: string;
                description: string;
            }
        ];
    };
    dateCreated: Date;
}

export interface Chat {
    chatId: string;
    title: string;
    initiatorId: number;
    receiverId: number;
    initiatorAvatar: string;
    receiverAvatar: string;
    initiatorName: string;
    receiverName: string;
    dateCreated: Date;
}
export interface Message {
    message: string;
    sentBy: number;
    chatId: string;
    dateCreated: Date;
}

export interface Notification {
    totalPages: number;
    totalElements: number;
    size: number;
    content: {
        id: number;
        type: string;
        title: string;
        message: string;
        resourceLink: string;
        read: boolean;
        dateCreated: Date;
    }[];
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    numberOfElements: number;
    pageable: {
        offset: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        pageNumber: number;
        pageSize: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    first: boolean;
    empty: boolean;
}

export interface ApiError {
    timestamp: string;
    status: string;
    message: string;
    debugMessage: string;
    subErrors: any;
}

export interface ErrorResponse {
    error: string;
    details: string;
}

export interface Profile {
    id: number;
    title: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    avatar: string;
    avgRating: number;
    reviewCount: number;
    status: string;
    mostRecentReview: ReviewDTO;
    phoneNumberVerified: boolean;
    dateVerified: Date;
    dateCreated: Date;
}

// Support System Interfaces
export interface SupportCallbackRequest {
    name: string;
    email: string;
    phoneNumber: string;
    message: string;
    preferredCallTime?: string;
}

export interface AbuseReportRequest {
    reportType: 'USER' | 'ITEM' | 'OTHER';
    targetId?: number;
    reason: string;
    description: string;
}

// Sorting options for items API
export type ItemSortOption = 'recent' | 'promoted' | 'price-low' | 'price-high';

// Like System Interfaces
export interface LikedItemsResponse {
    items: Item[];
    totalCount: number;
}

// API Response wrapper
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}
