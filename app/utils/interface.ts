export interface Item {
    id: number;
    title: string;
    description: string;
    imageUrls: [string];
    flipForImgUrls: [string];
    acceptCash: boolean;
    cashAmount: 0;
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
        avg_rating: 0;
        status: string;
        phoneNumberVerified: boolean;
        dateVerified: Date;
    };
    itemCategories: [
        {
            name: string;
            description: string;
        }
    ];
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
    createdDate: Date;
}
