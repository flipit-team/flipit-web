// Dummy data for testing purposes

export const dummyItems: any[] = [
    {
        id: 1,
        title: 'iPhone 13 Pro Max',
        description: 'Slightly used iPhone 13 Pro Max in excellent condition. Battery health at 96%.',
        imageUrls: ['/camera.png'],
        flipForImgUrls: ['/camera.png'],
        acceptCash: true,
        cashAmount: 480000,
        condition: 'used',
        published: true,
        location: 'Lekki Phase 1, Lagos',
        dateCreated: new Date('2025-07-01T10:00:00Z'),
        seller: {
            id: 'user_001',
            title: 'Mr.',
            firstName: 'Tunde',
            middleName: 'Ayodele',
            lastName: 'Johnson',
            email: 'tunde.johnson@example.com',
            phoneNumber: '+2348012345678',
            avatar: '/profile-picture.svg',
            avg_rating: 4.7,
            status: 'Verified',
            phoneNumberVerified: true,
            dateVerified: '2024-11-05T14:00:00Z',
            idVerified: true,
            reviewCount: 45,
            mostRecentReview: { rating: 5, message: 'Great seller!', userId: 1, postedById: 2, createdDate: '2024-11-05T14:00:00Z' }
        },
        itemCategories: [
            {name: 'Electronics', description: 'Devices like phones, laptops, gadgets, etc.'},
            {name: 'Mobile Phones', description: 'Smartphones and related accessories'}
        ]
    },
    {
        id: 2,
        title: 'Samsung Smart TV 55 inch',
        description: 'Brand new Samsung Smart TV with 4K resolution and voice control.',
        imageUrls: ['/camera.png'],
        flipForImgUrls: [],
        acceptCash: false,
        cashAmount: 0,
        condition: 'new',
        published: true,
        location: 'Ikeja, Lagos',
        dateCreated: new Date('2025-06-28T15:00:00Z'),
        seller: {
            id: 'user_002',
            title: 'Mrs.',
            firstName: 'Ada',
            middleName: 'Chinyere',
            lastName: 'Okoro',
            email: 'ada.okoro@example.com',
            phoneNumber: '+2348098765432',
            avatar: '/profile-picture.svg',
            avg_rating: 4.5,
            status: 'Verified',
            phoneNumberVerified: true,
            dateVerified: new Date('2025-01-10T09:30:00Z')
        },
        itemCategories: [
            {name: 'Home Appliances', description: 'Electronics for home use'},
            {name: 'Televisions', description: 'LED, Smart, and OLED TVs'}
        ]
    },
    {
        id: 3,
        title: 'MacBook Pro M1 2021',
        description: 'Lightly used MacBook Pro M1 with 16GB RAM, 512GB SSD.',
        imageUrls: ['/camera.png'],
        flipForImgUrls: [],
        acceptCash: true,
        cashAmount: 950000,
        condition: 'Used - Excellent',
        published: true,
        location: 'Victoria Island, Lagos',
        dateCreated: new Date('2025-07-03T11:45:00Z'),
        seller: {
            id: 'user_003',
            title: 'Mr.',
            firstName: 'Chuka',
            middleName: '',
            lastName: 'Eze',
            email: 'chuka.eze@example.com',
            phoneNumber: '+2347034567890',
            avatar: '/profile-picture.svg',
            avg_rating: 4.8,
            status: 'Verified',
            phoneNumberVerified: true,
            dateVerified: new Date('2024-08-18T08:00:00Z')
        },
        itemCategories: [{name: 'Computers', description: 'Laptops, desktops, and accessories'}]
    },
    {
        id: 4,
        title: 'Used Generator 3.5KVA',
        description: 'Working condition generator. Just changed the oil and plug.',
        imageUrls: ['/camera.png'],
        flipForImgUrls: [],
        acceptCash: true,
        cashAmount: 120000,
        condition: 'Used - Good',
        published: true,
        location: 'Abuja',
        dateCreated: new Date('2025-06-20T10:00:00Z'),
        seller: {
            id: 'user_004',
            title: 'Mr.',
            firstName: 'John',
            middleName: '',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phoneNumber: '+2347081234567',
            avatar: '/profile-picture.svg',
            avg_rating: 4.2,
            status: 'Verified',
            phoneNumberVerified: true,
            dateVerified: new Date('2025-03-15T10:30:00Z')
        },
        itemCategories: [{name: 'Power Supply', description: 'Generators, inverters, batteries'}]
    },
    {
        id: 5,
        title: 'HP LaserJet Printer',
        description: 'Office printer with toner. Fully functional.',
        imageUrls: ['/camera.png'],
        flipForImgUrls: [],
        acceptCash: false,
        cashAmount: 0,
        condition: 'Used - Fair',
        published: true,
        location: 'Yaba, Lagos',
        dateCreated: new Date('2025-07-05T09:00:00Z'),
        seller: {
            id: 'user_005',
            title: 'Ms.',
            firstName: 'Bola',
            middleName: 'Adebayo',
            lastName: 'Smith',
            email: 'bola.smith@example.com',
            phoneNumber: '+2347011223344',
            avatar: '/profile-picture.svg',
            avg_rating: 4.0,
            status: 'Verified',
            phoneNumberVerified: true,
            dateVerified: new Date('2024-12-01T12:00:00Z')
        },
        itemCategories: [{name: 'Office Equipment', description: 'Printers, scanners, copiers'}]
    },
    {
        id: 6,
        title: 'PlayStation 5 Console',
        description: 'Brand new PS5 console with one controller and FIFA 25.',
        imageUrls: ['/camera.png'],
        flipForImgUrls: [],
        acceptCash: true,
        cashAmount: 620000,
        condition: 'new',
        published: true,
        location: 'Port Harcourt',
        dateCreated: new Date('2025-06-30T14:30:00Z'),
        seller: {
            id: 'user_006',
            title: 'Mr.',
            firstName: 'Uche',
            middleName: '',
            lastName: 'Nwankwo',
            email: 'uche.nwankwo@example.com',
            phoneNumber: '+2348123456789',
            avatar: '/profile-picture.svg',
            avg_rating: 4.6,
            status: 'Verified',
            phoneNumberVerified: true,
            dateVerified: new Date('2024-07-20T08:45:00Z')
        },
        itemCategories: [{name: 'Gaming', description: 'Consoles, controllers, games'}]
    },
    {
        id: 7,
        title: 'Nike Air Max Sneakers',
        description: 'UK size 42, worn twice, still very neat.',
        imageUrls: ['/camera.png'],
        flipForImgUrls: [],
        acceptCash: true,
        cashAmount: 35000,
        condition: 'used',
        published: true,
        location: 'Festac Town, Lagos',
        dateCreated: new Date('2025-07-04T13:15:00Z'),
        seller: {
            id: 'user_007',
            title: 'Mr.',
            firstName: 'Emeka',
            middleName: '',
            lastName: 'Okafor',
            email: 'emeka.okafor@example.com',
            phoneNumber: '+2349098765432',
            avatar: '/profile-picture.svg',
            avg_rating: 4.3,
            status: 'Verified',
            phoneNumberVerified: true,
            dateVerified: new Date('2025-01-02T11:20:00Z')
        },
        itemCategories: [{name: 'Fashion', description: 'Shoes, clothing, accessories'}]
    },
    {
        id: 8,
        title: 'Bluetooth Wireless Earbuds',
        description: 'Noise-canceling, touch control, waterproof earbuds. New.',
        imageUrls: ['/camera.png'],
        flipForImgUrls: [],
        acceptCash: true,
        cashAmount: 15000,
        condition: 'new',
        published: true,
        location: 'Surulere, Lagos',
        dateCreated: new Date('2025-07-01T08:30:00Z'),
        seller: {
            id: 'user_008',
            title: 'Mr.',
            firstName: 'Segun',
            middleName: '',
            lastName: 'Afolabi',
            email: 'segun.afolabi@example.com',
            phoneNumber: '+2348076543210',
            avatar: '/profile-picture.svg',
            avg_rating: 4.1,
            status: 'Verified',
            phoneNumberVerified: true,
            dateVerified: new Date('2024-09-18T14:00:00Z')
        },
        itemCategories: [{name: 'Electronics', description: 'Audio devices and gadgets'}]
    },
    {
        id: 9,
        title: 'Wooden Dining Table Set',
        description: '6-seater dining set made from quality mahogany wood.',
        imageUrls: ['/camera.png'],
        flipForImgUrls: [],
        acceptCash: true,
        cashAmount: 220000,
        condition: 'Used - Good',
        published: true,
        location: 'Enugu',
        dateCreated: new Date('2025-06-25T16:00:00Z'),
        seller: {
            id: 'user_009',
            title: 'Mrs.',
            firstName: 'Ngozi',
            middleName: 'Onyeka',
            lastName: 'Eme',
            email: 'ngozi.eme@example.com',
            phoneNumber: '+2348101234567',
            avatar: '/profile-picture.svg',
            avg_rating: 4.4,
            status: 'Verified',
            phoneNumberVerified: true,
            dateVerified: new Date('2024-10-05T12:45:00Z')
        },
        itemCategories: [{name: 'Furniture', description: 'Tables, chairs, wardrobes'}]
    },
    {
        id: 10,
        title: 'Honda Civic 2008 Model',
        description: 'Engine in great shape, just repainted. Registered and used in Lagos.',
        imageUrls: ['/camera.png'],
        flipForImgUrls: [],
        acceptCash: true,
        cashAmount: 1800000,
        condition: 'Used - Fair',
        published: true,
        location: 'Ojota, Lagos',
        dateCreated: new Date('2025-07-02T10:00:00Z'),
        seller: {
            id: 'user_010',
            title: 'Mr.',
            firstName: 'Ibrahim',
            middleName: 'Sule',
            lastName: 'Ahmed',
            email: 'ibrahim.ahmed@example.com',
            phoneNumber: '+2348023456789',
            avatar: '/profile-picture.svg',
            avg_rating: 4.6,
            status: 'Verified',
            phoneNumberVerified: true,
            dateVerified: new Date('2024-08-12T09:15:00Z')
        },
        itemCategories: [{name: 'Automobiles', description: 'Cars, SUVs, vehicles'}]
    }
];

export const dummyChats: any = {
    buyer: [
        {
            chatId: 'chat_001',
            title: 'iPhone 13 Pro Max',
            initiatorId: 1,
            receiverId: 2,
            initiatorName: 'Tunde Johnson',
            receiverName: 'John Doe',
            initiatorAvatar: '/profile-picture.svg',
            receiverAvatar: '/profile-picture.svg',
            dateCreated: new Date('2025-07-12T10:30:00Z')
        },
        {
            chatId: 'chat_002', 
            title: 'Samsung Smart TV 55 inch',
            initiatorId: 3,
            receiverId: 2,
            initiatorName: 'Ada Okafor',
            receiverName: 'John Doe',
            initiatorAvatar: '/profile-picture.svg',
            receiverAvatar: '/profile-picture.svg',
            dateCreated: new Date('2025-07-11T14:20:00Z')
        }
    ],
    seller: [
        {
            chatId: 'chat_003',
            title: 'HP LaserJet Printer',
            initiatorId: 4,
            receiverId: 2,
            initiatorName: 'Michael Chen',
            receiverName: 'John Doe',
            initiatorAvatar: '/profile-picture.svg',
            receiverAvatar: '/profile-picture.svg',
            dateCreated: new Date('2025-07-10T09:15:00Z')
        },
        {
            chatId: 'chat_004',
            title: 'Generator 5KVA',
            initiatorId: 5,
            receiverId: 2,
            initiatorName: 'Sarah Williams',
            receiverName: 'John Doe',
            initiatorAvatar: '/profile-picture.svg',
            receiverAvatar: '/profile-picture.svg',
            dateCreated: new Date('2025-07-09T16:45:00Z')
        }
    ]
};

export const dummyNotifications: any = {
    totalPages: 1,
    totalElements: 3,
    size: 10,
    number: 0,
    content: [
        {
            id: 1,
            type: 'bid',
            title: 'New bid received',
            message: 'Someone placed a bid on your iPhone 13 Pro Max',
            resourceLink: '/my-items/1',
            read: false,
            dateCreated: new Date('2025-07-12T10:30:00Z')
        },
        {
            id: 2,
            type: 'sale',
            title: 'Item sold',
            message: 'Your Samsung Smart TV has been sold!',
            resourceLink: '/my-items/2',
            read: true,
            dateCreated: new Date('2025-07-11T14:20:00Z')
        },
        {
            id: 3,
            type: 'message',
            title: 'New message',
            message: 'You have a new message about HP LaserJet Printer',
            resourceLink: '/messages/chat_003',
            read: false,
            dateCreated: new Date('2025-07-10T09:15:00Z')
        }
    ],
    sort: {
        empty: false,
        sorted: true,
        unsorted: false
    },
    numberOfElements: 3,
    pageable: {
        offset: 0,
        sort: {
            empty: false,
            sorted: true,
            unsorted: false
        },
        pageNumber: 0,
        pageSize: 10,
        paged: true,
        unpaged: false
    },
    last: true,
    first: true,
    empty: false
};

export const dummyProfile: any = {
    id: 1,
    title: 'Mr.',
    firstName: 'John',
    middleName: '',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+2348012345678',
    avatar: '/profile-picture.svg',
    avgRating: 4.5,
    reviewCount: 12,
    status: 'active',
    mostRecentReview: {
        rating: 5,
        message: 'Great seller, highly recommended!',
        userId: 1,
        postedById: 2,
        createdDate: new Date('2025-07-01T10:00:00Z')
    },
    phoneNumberVerified: true,
    dateVerified: new Date('2025-07-01T10:00:00Z'),
    dateCreated: new Date('2025-07-01T10:00:00Z')
};
