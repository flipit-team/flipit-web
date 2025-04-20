export interface Item {
    id: number;
    title: string;
    description: string;
    imageUrls: [string];
    flipForImgUrls: [string];
    acceptCash: true;
    cashAmount: 0;
    condition: string | null;
    published: true;
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
        phoneNumberVerified: true;
        dateVerified: Date;
    };
    itemCategories: [
        {
            name: string;
            description: string;
        }
    ];
}
