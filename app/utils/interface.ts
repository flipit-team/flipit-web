export interface Item {
    id: number;
    title: string;
    description: string;
    imageUrls: string[];
    flipForImgUrls: string[];
    acceptCash: boolean;
    cashAmount: number;
    condition: string | null;
    published: boolean;
    location: string;
    dateCreated: Date;
    seller: {
        id: string;
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
    };
    itemCategories: {
        name: string;
        description: string;
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
    content: [
        {
            id: number;
            type: string;
            title: string;
            message: string;
            resourceLink: string;
            read: boolean;
            dateCreated: Date;
        }
    ];
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
    mostRecentReview: {
        rating: number;
        message: string;
        userId: number;
        postedById: number;
        createdDate: Date;
    };
    phoneNumberVerified: boolean;
    dateVerified: Date;
    dateCreated: Date;
}
