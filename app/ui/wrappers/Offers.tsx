'use client';
import Image from 'next/image';
import Link from 'next/link';
import {useState, useMemo} from 'react';
import {Bid} from '~/utils/interface';
import NoData from '../common/no-data/NoData';
import {formatToNaira, timeAgo} from '~/utils/helpers';
import RegularButton from '../common/buttons/RegularButton';
import StarRating from '../common/star-rating/StarRating';
import CountdownTimer from '../common/countdown-timer/CountdownTimer';

// Extended Bid interface with auction details
interface ExtendedBid extends Bid {
    auctionDetails?: {
        endDate: string;
        currentBid: number;
        totalBids: number;
        isAuction: boolean;
        reservePrice?: number;
        bidIncrement?: number;
    };
    bidPosition?: number;
    actionRequired?: boolean;
    maxBid?: number; // User's secret maximum bid
    watchers?: number; // Number of people watching
    bidHistory?: Array<{
        amount: number;
        bidder: string;
        time: string;
    }>;
}

// Received Bid Interface (bids on YOUR items)
interface ReceivedBid {
    id: number;
    bidAmount: number;
    bidder: {
        id: number;
        name: string;
        avatar: string;
        rating: number;
        verified: boolean;
    };
    item: {
        id: number;
        title: string;
        imageUrl: string;
        currentBid: number;
        totalBids: number;
        reservePrice?: number;
        reserveMet: boolean;
        endDate?: string;
        isAuction: boolean;
    };
    status: 'ACTIVE' | 'HIGHEST' | 'OUTBID' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'PAID' | 'DELIVERED' | 'CANCELLED';
    dateCreated: Date;
    isHighest: boolean;
}

interface Props {
    bids?: ExtendedBid[] | null;
    receivedBids?: ReceivedBid[] | null;
}

type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'OUTBID' | 'WINNING' | 'WON' | 'LOST' | 'EXPIRED' | 'CANCELLED' | 'PAID' | 'COMPLETED' | 'IN_PROGRESS' | 'DELIVERED' | 'COUNTER_OFFER';
type ViewMode = 'list' | 'card' | 'table';
type FilterStatus = OfferStatus | 'ALL';
type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | 'status-priority';
type TabMode = 'my-offers' | 'received-offers' | 'watchlist';

// Dummy data - MY BIDS (bids I made on other people's items)
const dummyMyBids: ExtendedBid[] = [
    {
        id: 1,
        withCash: true,
        cashAmount: 1450000,
        maxBid: 1600000,
        status: 'WINNING',
        actionRequired: true,
        bidPosition: 1,
        watchers: 12,
        dateCreated: new Date(Date.now() - 2 * 60 * 60 * 1000),
        sentBy: {
            id: 999,
            title: '',
            firstName: 'You',
            middleName: '',
            lastName: '',
            email: 'you@example.com',
            phoneNumber: '+234',
            avatar: '/placeholder-avatar.svg',
            avg_rating: 4.5,
            status: 'active',
            phoneNumberVerified: true,
            dateVerified: new Date(),
            dateCreated: new Date()
        },
        auctionItem: {
            id: 101,
            title: 'MacBook Pro M2 16" - Space Gray',
            description: 'Excellent condition MacBook Pro with M2 Max chip',
            imageUrls: ['/placeholder-product.svg'],
            flipForImgUrls: ['/placeholder-product.svg'],
            acceptCash: true,
            cashAmount: 1500000,
            published: true,
            location: 'Lagos, Nigeria',
            condition: 'Like New',
            dateCreated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            seller: {
                id: 201,
                title: '',
                firstName: 'Sarah',
                middleName: '',
                lastName: 'Johnson',
                email: 'sarah@example.com',
                phoneNumber: '+234',
                avatar: '/placeholder-avatar.svg',
                avg_rating: 4.9,
                status: 'active',
                phoneNumberVerified: true,
                dateVerified: new Date(),
                dateCreated: new Date()
            },
            itemCategories: [{name: 'Electronics', description: 'Electronics'}]
        },
        offeredItem: {
            id: 0,
            title: 'Cash Bid',
            description: 'Cash offer',
            imageUrls: [""],
            flipForImgUrls: [""],
            acceptCash: true,
            cashAmount: 1450000,
            published: true,
            location: '',
            condition: 'new',
            dateCreated: new Date(),
            seller: {
                id: 999,
                title: '',
                firstName: 'You',
                middleName: '',
                lastName: '',
                email: 'you@example.com',
                phoneNumber: '',
                avatar: '',
                avg_rating: 0,
                status: 'active',
                phoneNumberVerified: false,
                dateVerified: new Date(),
                dateCreated: new Date()
            },
            itemCategories: [{name: "", description: ""}]
        },
        auctionDetails: {
            endDate: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
            currentBid: 1450000,
            totalBids: 8,
            isAuction: true,
            reservePrice: 1500000,
            bidIncrement: 50000
        },
        bidHistory: [
            {amount: 1450000, bidder: 'You', time: new Date(Date.now() - 15 * 60 * 1000).toISOString()},
            {amount: 1400000, bidder: 'John D.', time: new Date(Date.now() - 45 * 60 * 1000).toISOString()},
            {amount: 1350000, bidder: 'You', time: new Date(Date.now() - 90 * 60 * 1000).toISOString()}
        ]
    },
    {
        id: 2,
        withCash: true,
        cashAmount: 850000,
        status: 'WON',
        actionRequired: true,
        dateCreated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        watchers: 8,
        sentBy: {
            id: 999,
            title: '',
            firstName: 'You',
            middleName: '',
            lastName: '',
            email: 'you@example.com',
            phoneNumber: '+234',
            avatar: '/placeholder-avatar.svg',
            avg_rating: 4.5,
            status: 'active',
            phoneNumberVerified: true,
            dateVerified: new Date(),
            dateCreated: new Date()
        },
        auctionItem: {
            id: 102,
            title: 'iPhone 14 Pro Max 256GB',
            description: 'Brand new sealed iPhone',
            imageUrls: ['/placeholder-product.svg'],
            flipForImgUrls: ['/placeholder-product.svg'],
            acceptCash: true,
            cashAmount: 900000,
            published: true,
            location: 'Abuja, Nigeria',
            condition: 'Brand New',
            dateCreated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            seller: {
                id: 202,
                title: '',
                firstName: 'Michael',
                middleName: '',
                lastName: 'Chen',
                email: 'michael@example.com',
                phoneNumber: '+234',
                avatar: '/placeholder-avatar.svg',
                avg_rating: 4.7,
                status: 'active',
                phoneNumberVerified: true,
                dateVerified: new Date(),
                dateCreated: new Date()
            },
            itemCategories: [{name: 'Electronics', description: 'Electronics'}]
        },
        offeredItem: {
            id: 0,
            title: 'Cash Bid',
            description: 'Cash offer',
            imageUrls: [""],
            flipForImgUrls: [""],
            acceptCash: true,
            cashAmount: 850000,
            published: true,
            location: '',
            condition: 'new',
            dateCreated: new Date(),
            seller: {
                id: 999,
                title: '',
                firstName: 'You',
                middleName: '',
                lastName: '',
                email: 'you@example.com',
                phoneNumber: '',
                avatar: '',
                avg_rating: 0,
                status: 'active',
                phoneNumberVerified: false,
                dateVerified: new Date(),
                dateCreated: new Date()
            },
            itemCategories: [{name: "", description: ""}]
        },
        auctionDetails: {
            endDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            currentBid: 850000,
            totalBids: 12,
            isAuction: true,
            reservePrice: 800000,
            bidIncrement: 25000
        }
    },
    {
        id: 3,
        withCash: true,
        cashAmount: 350000,
        maxBid: 420000,
        status: 'OUTBID',
        bidPosition: 3,
        actionRequired: true,
        watchers: 15,
        dateCreated: new Date(Date.now() - 5 * 60 * 60 * 1000),
        sentBy: {
            id: 999,
            title: '',
            firstName: 'You',
            middleName: '',
            lastName: '',
            email: 'you@example.com',
            phoneNumber: '+234',
            avatar: '/placeholder-avatar.svg',
            avg_rating: 4.5,
            status: 'active',
            phoneNumberVerified: true,
            dateVerified: new Date(),
            dateCreated: new Date()
        },
        auctionItem: {
            id: 103,
            title: 'PlayStation 5 Console + 2 Controllers',
            description: 'PS5 with original box and accessories',
            imageUrls: ['/placeholder-product.svg'],
            flipForImgUrls: ['/placeholder-product.svg'],
            acceptCash: true,
            cashAmount: 400000,
            published: true,
            location: 'Port Harcourt, Nigeria',
            condition: 'Used',
            dateCreated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            seller: {
                id: 203,
                title: '',
                firstName: 'David',
                middleName: '',
                lastName: 'Okafor',
                email: 'david@example.com',
                phoneNumber: '+234',
                avatar: '/placeholder-avatar.svg',
                avg_rating: 4.6,
                status: 'active',
                phoneNumberVerified: true,
                dateVerified: new Date(),
                dateCreated: new Date()
            },
            itemCategories: [{name: 'Gaming', description: 'Gaming'}]
        },
        offeredItem: {
            id: 0,
            title: 'Cash Bid',
            description: 'Cash offer',
            imageUrls: [""],
            flipForImgUrls: [""],
            acceptCash: true,
            cashAmount: 350000,
            published: true,
            location: '',
            condition: 'new',
            dateCreated: new Date(),
            seller: {
                id: 999,
                title: '',
                firstName: 'You',
                middleName: '',
                lastName: '',
                email: 'you@example.com',
                phoneNumber: '',
                avatar: '',
                avg_rating: 0,
                status: 'active',
                phoneNumberVerified: false,
                dateVerified: new Date(),
                dateCreated: new Date()
            },
            itemCategories: [{name: "", description: ""}]
        },
        auctionDetails: {
            endDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
            currentBid: 375000,
            totalBids: 6,
            isAuction: true,
            reservePrice: 380000,
            bidIncrement: 10000
        }
    },
    {
        id: 4,
        withCash: true,
        cashAmount: 120000,
        status: 'PENDING',
        watchers: 5,
        dateCreated: new Date(Date.now() - 8 * 60 * 60 * 1000),
        sentBy: {
            id: 999,
            title: '',
            firstName: 'You',
            middleName: '',
            lastName: '',
            email: 'you@example.com',
            phoneNumber: '+234',
            avatar: '/placeholder-avatar.svg',
            avg_rating: 4.5,
            status: 'active',
            phoneNumberVerified: true,
            dateVerified: new Date(),
            dateCreated: new Date()
        },
        auctionItem: {
            id: 104,
            title: 'Samsung 55" 4K Smart TV',
            description: '2023 model with HDR support',
            imageUrls: ['/placeholder-product.svg'],
            flipForImgUrls: ['/placeholder-product.svg'],
            acceptCash: true,
            cashAmount: 150000,
            published: true,
            location: 'Ibadan, Nigeria',
            condition: 'Good',
            dateCreated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            seller: {
                id: 204,
                title: '',
                firstName: 'Amina',
                middleName: '',
                lastName: 'Bello',
                email: 'amina@example.com',
                phoneNumber: '+234',
                avatar: '/placeholder-avatar.svg',
                avg_rating: 4.8,
                status: 'active',
                phoneNumberVerified: true,
                dateVerified: new Date(),
                dateCreated: new Date()
            },
            itemCategories: [{name: 'Electronics', description: 'Electronics'}]
        },
        offeredItem: {
            id: 0,
            title: 'Cash Bid',
            description: 'Cash offer',
            imageUrls: [""],
            flipForImgUrls: [""],
            acceptCash: true,
            cashAmount: 120000,
            published: true,
            location: '',
            condition: 'new',
            dateCreated: new Date(),
            seller: {
                id: 999,
                title: '',
                firstName: 'You',
                middleName: '',
                lastName: '',
                email: 'you@example.com',
                phoneNumber: '',
                avatar: '',
                avg_rating: 0,
                status: 'active',
                phoneNumberVerified: false,
                dateVerified: new Date(),
                dateCreated: new Date()
            },
            itemCategories: [{name: "", description: ""}]
        },
        auctionDetails: {
            endDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
            currentBid: 120000,
            totalBids: 1,
            isAuction: false
        }
    },
    {
        id: 5,
        withCash: true,
        cashAmount: 450000,
        status: 'ACCEPTED',
        actionRequired: true,
        watchers: 3,
        dateCreated: new Date(Date.now() - 12 * 60 * 60 * 1000),
        sentBy: {
            id: 999,
            title: '',
            firstName: 'You',
            middleName: '',
            lastName: '',
            email: 'you@example.com',
            phoneNumber: '+234',
            avatar: '/placeholder-avatar.svg',
            avg_rating: 4.5,
            status: 'active',
            phoneNumberVerified: true,
            dateVerified: new Date(),
            dateCreated: new Date()
        },
        auctionItem: {
            id: 105,
            title: 'Canon EOS R6 Camera Body',
            description: 'Professional mirrorless camera',
            imageUrls: ['/placeholder-product.svg'],
            flipForImgUrls: ['/placeholder-product.svg'],
            acceptCash: true,
            cashAmount: 480000,
            published: true,
            location: 'Lagos, Nigeria',
            condition: 'Like New',
            dateCreated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            seller: {
                id: 205,
                title: '',
                firstName: 'Chidi',
                middleName: '',
                lastName: 'Nwosu',
                email: 'chidi@example.com',
                phoneNumber: '+234',
                avatar: '/placeholder-avatar.svg',
                avg_rating: 4.9,
                status: 'active',
                phoneNumberVerified: true,
                dateVerified: new Date(),
                dateCreated: new Date()
            },
            itemCategories: [{name: 'Cameras', description: 'Cameras'}]
        },
        offeredItem: {
            id: 0,
            title: 'Cash Bid',
            description: 'Cash offer',
            imageUrls: [""],
            flipForImgUrls: [""],
            acceptCash: true,
            cashAmount: 450000,
            published: true,
            location: '',
            condition: 'new',
            dateCreated: new Date(),
            seller: {
                id: 999,
                title: '',
                firstName: 'You',
                middleName: '',
                lastName: '',
                email: 'you@example.com',
                phoneNumber: '',
                avatar: '',
                avg_rating: 0,
                status: 'active',
                phoneNumberVerified: false,
                dateVerified: new Date(),
                dateCreated: new Date()
            },
            itemCategories: [{name: "", description: ""}]
        },
        auctionDetails: {
            endDate: '',
            currentBid: 450000,
            totalBids: 3,
            isAuction: false
        }
    },
    {
        id: 6,
        withCash: true,
        cashAmount: 250000,
        status: 'REJECTED',
        dateCreated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        watchers: 2,
        sentBy: {
            id: 999,
            title: '',
            firstName: 'You',
            middleName: '',
            lastName: '',
            email: 'you@example.com',
            phoneNumber: '+234',
            avatar: '/placeholder-avatar.svg',
            avg_rating: 4.5,
            status: 'active',
            phoneNumberVerified: true,
            dateVerified: new Date(),
            dateCreated: new Date()
        },
        auctionItem: {
            id: 106,
            title: 'Nike Air Jordan 1 Retro - Size 42',
            description: 'Authentic sneakers, worn once',
            imageUrls: ['/placeholder-product.svg'],
            flipForImgUrls: ['/placeholder-product.svg'],
            acceptCash: true,
            cashAmount: 300000,
            published: true,
            location: 'Lagos, Nigeria',
            condition: 'Like New',
            dateCreated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            seller: {
                id: 206,
                title: '',
                firstName: 'Tunde',
                middleName: '',
                lastName: 'Adebayo',
                email: 'tunde@example.com',
                phoneNumber: '+234',
                avatar: '/placeholder-avatar.svg',
                avg_rating: 4.3,
                status: 'active',
                phoneNumberVerified: true,
                dateVerified: new Date(),
                dateCreated: new Date()
            },
            itemCategories: [{name: 'Fashion', description: 'Fashion'}]
        },
        offeredItem: {
            id: 0,
            title: 'Cash Offer',
            description: 'Cash offer',
            imageUrls: [""],
            flipForImgUrls: [""],
            acceptCash: true,
            cashAmount: 250000,
            published: true,
            location: '',
            condition: 'new',
            dateCreated: new Date(),
            seller: {
                id: 999,
                title: '',
                firstName: 'You',
                middleName: '',
                lastName: '',
                email: 'you@example.com',
                phoneNumber: '',
                avatar: '',
                avg_rating: 0,
                status: 'active',
                phoneNumberVerified: false,
                dateVerified: new Date(),
                dateCreated: new Date()
            },
            itemCategories: [{name: "", description: ""}]
        },
        auctionDetails: {
            endDate: '',
            currentBid: 250000,
            totalBids: 1,
            isAuction: false
        }
    },
    {
        id: 7,
        withCash: true,
        cashAmount: 550000,
        status: 'COMPLETED',
        dateCreated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        watchers: 0,
        sentBy: {
            id: 999,
            title: '',
            firstName: 'You',
            middleName: '',
            lastName: '',
            email: 'you@example.com',
            phoneNumber: '+234',
            avatar: '/placeholder-avatar.svg',
            avg_rating: 4.5,
            status: 'active',
            phoneNumberVerified: true,
            dateVerified: new Date(),
            dateCreated: new Date()
        },
        auctionItem: {
            id: 107,
            title: 'DJI Mavic Air 2 Drone',
            description: 'Complete package with extra batteries',
            imageUrls: ['/placeholder-product.svg'],
            flipForImgUrls: ['/placeholder-product.svg'],
            acceptCash: true,
            cashAmount: 580000,
            published: true,
            location: 'Lagos, Nigeria',
            condition: 'Used',
            dateCreated: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
            seller: {
                id: 207,
                title: '',
                firstName: 'John',
                middleName: '',
                lastName: 'Eze',
                email: 'john@example.com',
                phoneNumber: '+234',
                avatar: '/placeholder-avatar.svg',
                avg_rating: 4.8,
                status: 'active',
                phoneNumberVerified: true,
                dateVerified: new Date(),
                dateCreated: new Date()
            },
            itemCategories: [{name: 'Drones', description: 'Drones'}]
        },
        offeredItem: {
            id: 0,
            title: 'Cash Offer',
            description: 'Cash offer',
            imageUrls: [""],
            flipForImgUrls: [""],
            acceptCash: true,
            cashAmount: 550000,
            published: true,
            location: '',
            condition: 'new',
            dateCreated: new Date(),
            seller: {
                id: 999,
                title: '',
                firstName: 'You',
                middleName: '',
                lastName: '',
                email: 'you@example.com',
                phoneNumber: '',
                avatar: '',
                avg_rating: 0,
                status: 'active',
                phoneNumberVerified: false,
                dateVerified: new Date(),
                dateCreated: new Date()
            },
            itemCategories: [{name: "", description: ""}]
        },
        auctionDetails: {
            endDate: '',
            currentBid: 550000,
            totalBids: 1,
            isAuction: false
        }
    },
    {
        id: 8,
        withCash: true,
        cashAmount: 95000,
        status: 'CANCELLED',
        dateCreated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        watchers: 1,
        sentBy: {
            id: 999,
            title: '',
            firstName: 'You',
            middleName: '',
            lastName: '',
            email: 'you@example.com',
            phoneNumber: '+234',
            avatar: '/placeholder-avatar.svg',
            avg_rating: 4.5,
            status: 'active',
            phoneNumberVerified: true,
            dateVerified: new Date(),
            dateCreated: new Date()
        },
        auctionItem: {
            id: 108,
            title: 'Bose QuietComfort 45 Headphones',
            description: 'Noise-cancelling wireless headphones',
            imageUrls: ['/placeholder-product.svg'],
            flipForImgUrls: ['/placeholder-product.svg'],
            acceptCash: true,
            cashAmount: 120000,
            published: true,
            location: 'Abuja, Nigeria',
            condition: 'Good',
            dateCreated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            seller: {
                id: 208,
                title: '',
                firstName: 'Grace',
                middleName: '',
                lastName: 'Okoro',
                email: 'grace@example.com',
                phoneNumber: '+234',
                avatar: '/placeholder-avatar.svg',
                avg_rating: 4.4,
                status: 'active',
                phoneNumberVerified: true,
                dateVerified: new Date(),
                dateCreated: new Date()
            },
            itemCategories: [{name: 'Audio', description: 'Audio'}]
        },
        offeredItem: {
            id: 0,
            title: 'Cash Offer',
            description: 'Cash offer',
            imageUrls: [""],
            flipForImgUrls: [""],
            acceptCash: true,
            cashAmount: 95000,
            published: true,
            location: '',
            condition: 'new',
            dateCreated: new Date(),
            seller: {
                id: 999,
                title: '',
                firstName: 'You',
                middleName: '',
                lastName: '',
                email: 'you@example.com',
                phoneNumber: '',
                avatar: '',
                avg_rating: 0,
                status: 'active',
                phoneNumberVerified: false,
                dateVerified: new Date(),
                dateCreated: new Date()
            },
            itemCategories: [{name: "", description: ""}]
        },
        auctionDetails: {
            endDate: '',
            currentBid: 95000,
            totalBids: 1,
            isAuction: false
        }
    }
];

// Dummy data - RECEIVED BIDS (bids on MY items)
const dummyReceivedBids: ReceivedBid[] = [
    {
        id: 201,
        bidAmount: 720000,
        bidder: {
            id: 301,
            name: 'James Wilson',
            avatar: '/placeholder-avatar.svg',
            rating: 4.6,
            verified: true
        },
        item: {
            id: 501,
            title: 'Sony WH-1000XM5 Headphones',
            imageUrl: '/placeholder-product.svg',
            currentBid: 720000,
            totalBids: 5,
            reservePrice: 700000,
            reserveMet: true,
            endDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            isAuction: true
        },
        status: 'HIGHEST',
        dateCreated: new Date(Date.now() - 30 * 60 * 1000),
        isHighest: true
    },
    {
        id: 202,
        bidAmount: 280000,
        bidder: {
            id: 302,
            name: 'Aisha Mohammed',
            avatar: '/placeholder-avatar.svg',
            rating: 4.8,
            verified: true
        },
        item: {
            id: 502,
            title: 'iPad Air 2024 - 256GB',
            imageUrl: '/placeholder-product.svg',
            currentBid: 320000,
            totalBids: 8,
            reservePrice: 350000,
            reserveMet: false,
            endDate: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
            isAuction: true
        },
        status: 'OUTBID',
        dateCreated: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isHighest: false
    },
    {
        id: 203,
        bidAmount: 450000,
        bidder: {
            id: 303,
            name: 'Emeka Obi',
            avatar: '/placeholder-avatar.svg',
            rating: 4.5,
            verified: false
        },
        item: {
            id: 503,
            title: 'Gaming Laptop - RTX 4060',
            imageUrl: '/placeholder-product.svg',
            currentBid: 450000,
            totalBids: 3,
            reservePrice: 500000,
            reserveMet: false,
            endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            isAuction: false
        },
        status: 'ACTIVE',
        dateCreated: new Date(Date.now() - 6 * 60 * 60 * 1000),
        isHighest: true
    },
    {
        id: 204,
        bidAmount: 180000,
        bidder: {
            id: 304,
            name: 'Linda Chen',
            avatar: '/placeholder-avatar.svg',
            rating: 4.9,
            verified: true
        },
        item: {
            id: 504,
            title: 'Apple Watch Series 9',
            imageUrl: '/placeholder-product.svg',
            currentBid: 180000,
            totalBids: 2,
            isAuction: false,
            reserveMet: false
        },
        status: 'ACTIVE',
        dateCreated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isHighest: true
    },
    {
        id: 205,
        bidAmount: 380000,
        bidder: {
            id: 305,
            name: 'Peter Obi',
            avatar: '/placeholder-avatar.svg',
            rating: 4.7,
            verified: true
        },
        item: {
            id: 505,
            title: 'Samsung Galaxy Tab S9',
            imageUrl: '/placeholder-product.svg',
            currentBid: 380000,
            totalBids: 2,
            isAuction: false,
            reserveMet: true
        },
        status: 'COMPLETED',
        dateCreated: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        isHighest: true
    },
    {
        id: 206,
        bidAmount: 150000,
        bidder: {
            id: 306,
            name: 'Chioma Eze',
            avatar: '/placeholder-avatar.svg',
            rating: 4.5,
            verified: false
        },
        item: {
            id: 506,
            title: 'Xbox Series X - 1TB',
            imageUrl: '/placeholder-product.svg',
            currentBid: 150000,
            totalBids: 1,
            isAuction: false,
            reserveMet: false
        },
        status: 'REJECTED',
        dateCreated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        isHighest: true
    },
    {
        id: 207,
        bidAmount: 520000,
        bidder: {
            id: 307,
            name: 'Ahmed Musa',
            avatar: '/placeholder-avatar.svg',
            rating: 4.9,
            verified: true
        },
        item: {
            id: 507,
            title: 'MacBook Air M2 - 512GB',
            imageUrl: '/placeholder-product.svg',
            currentBid: 520000,
            totalBids: 3,
            isAuction: false,
            reserveMet: true
        },
        status: 'PAID',
        dateCreated: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        isHighest: true
    }
];

const Offers = (props: Props) => {
    const {bids: propsBids, receivedBids: propsReceivedBids} = props;
    const myBids = propsBids || dummyMyBids;
    const receivedBids = propsReceivedBids || dummyReceivedBids;

    // State
    const [activeTab, setActiveTab] = useState<TabMode>('my-offers');
    const [viewMode, setViewMode] = useState<ViewMode>('card');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
    const [sortOption, setSortOption] = useState<SortOption>('status-priority');
    const [selectedBidId, setSelectedBidId] = useState<number | null>(null);
    const [showBudgetManager, setShowBudgetManager] = useState(false);
    const [budget, setBudget] = useState(5000000);
    const [showMaxBidModal, setShowMaxBidModal] = useState(false);
    const [selectedBidForMaxBid, setSelectedBidForMaxBid] = useState<number | null>(null);
    const [maxBidAmount, setMaxBidAmount] = useState('');
    const [showNotificationSettings, setShowNotificationSettings] = useState(false);

    // Get status styling - Using brand colors (Teal, Yellow, Coral, Navy)
    const getStatusStyle = (status: string) => {
        const styles: Record<string, string> = {
            // Success states - Teal (primary)
            WINNING: 'bg-surface-primary text-primary border-primary/20',
            WON: 'bg-surface-primary text-primary border-primary/20',
            COMPLETED: 'bg-surface-primary text-primary border-primary/20',
            DELIVERED: 'bg-surface-primary text-primary border-primary/20',
            HIGHEST: 'bg-surface-primary text-primary border-primary/20',

            // Pending/Active states - Yellow (secondary)
            PENDING: 'bg-surface-secondary text-warning border-warning/20',
            ACTIVE: 'bg-surface-secondary text-warning border-warning/20',
            IN_PROGRESS: 'bg-surface-secondary text-warning border-warning/20',

            // Accepted/Paid - Navy (accent)
            ACCEPTED: 'bg-accent-navy/5 text-accent-navy border-accent-navy/20',
            PAID: 'bg-accent-navy/5 text-accent-navy border-accent-navy/20',

            // Warning states - Coral (accent)
            OUTBID: 'bg-surface-warning text-warning border-warning/20',
            COUNTER_OFFER: 'bg-surface-warning text-warning border-warning/20',

            // Negative states - Error (using existing error color)
            REJECTED: 'bg-surface-error text-error border-error/20',
            LOST: 'bg-gray-100 text-text_four border-border_gray',
            CANCELLED: 'bg-gray-100 text-text_four border-border_gray',
            EXPIRED: 'bg-gray-100 text-text_four border-border_gray'
        };
        return styles[status] || 'bg-gray-100 text-text_four border-border_gray';
    };

    // Filter and sort bids
    const filteredAndSortedBids = useMemo(() => {
        let result = [...myBids];

        if (filterStatus !== 'ALL') {
            result = result.filter(bid => bid.status === filterStatus);
        }

        switch (sortOption) {
            case 'date-desc':
                result.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
                break;
            case 'date-asc':
                result.sort((a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime());
                break;
            case 'amount-desc':
                result.sort((a, b) => b.cashAmount - a.cashAmount);
                break;
            case 'amount-asc':
                result.sort((a, b) => a.cashAmount - b.cashAmount);
                break;
            case 'status-priority':
                const priority: Record<string, number> = {
                    WON: 1, ACCEPTED: 2, WINNING: 3, OUTBID: 4, PENDING: 5,
                    REJECTED: 6, LOST: 7, EXPIRED: 8, CANCELLED: 9, PAID: 10, COMPLETED: 11
                };
                result.sort((a, b) => (priority[a.status] || 99) - (priority[b.status] || 99));
                break;
        }

        return result;
    }, [myBids, filterStatus, sortOption]);

    // Calculate stats for MY BIDS
    const myBidsStats = useMemo(() => {
        const totalBids = myBids.length;
        const activeBids = myBids.filter(b => ['WINNING', 'PENDING', 'ACCEPTED', 'WON'].includes(b.status)).length;
        const wonBids = myBids.filter(b => ['WON', 'COMPLETED'].includes(b.status)).length;
        const totalSpent = myBids.filter(b => ['WON', 'COMPLETED', 'PAID'].includes(b.status)).reduce((sum, b) => sum + b.cashAmount, 0);
        const actionRequired = myBids.filter(b => b.actionRequired).length;
        const winRate = totalBids > 0 ? Math.round((wonBids / totalBids) * 100) : 0;
        const totalSaved = myBids.filter(b => b.maxBid && b.status === 'WON').reduce((sum, b) => sum + ((b.maxBid || 0) - b.cashAmount), 0);

        return {totalBids, activeBids, wonBids, totalSpent, actionRequired, winRate, totalSaved};
    }, [myBids]);

    // Calculate stats for RECEIVED BIDS
    const receivedBidsStats = useMemo(() => {
        const totalBids = receivedBids.length;
        const activeBids = receivedBids.filter(b => ['ACTIVE', 'HIGHEST'].includes(b.status)).length;
        const totalRevenue = receivedBids.filter(b => b.status === 'ACCEPTED').reduce((sum, b) => sum + b.bidAmount, 0);
        const averageBid = totalBids > 0 ? Math.round(receivedBids.reduce((sum, b) => sum + b.bidAmount, 0) / totalBids) : 0;

        return {totalBids, activeBids, totalRevenue, averageBid};
    }, [receivedBids]);

    // Action Required Items
    const actionRequiredItems = myBids.filter(b => b.actionRequired);

    const selectedBid = myBids.find(b => b.id === selectedBidId);

    return (
        <div className='mx-[120px] xs:mx-0 my-6 xs:my-0'>
            {/* Header with Tabs */}
            <div className='flex items-center justify-between my-6 xs:mx-4 xs:flex-col xs:items-start xs:gap-4'>
                <div>
                    <h1 className='typo-heading_ms mb-3'>Offers Dashboard</h1>

                    {/* Tab Navigation */}
                    <div className='flex gap-2 border-b border-border_gray'>
                        <button
                            onClick={() => setActiveTab('my-offers')}
                            className={`px-4 py-2 typo-body_lr transition-all ${
                                activeTab === 'my-offers'
                                    ? 'text-primary border-b-2 border-primary -mb-[1px]'
                                    : 'text-text_four hover:text-text_one'
                            }`}
                        >
                            My Offers ({myBids.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('received-offers')}
                            className={`px-4 py-2 typo-body_lr transition-all ${
                                activeTab === 'received-offers'
                                    ? 'text-primary border-b-2 border-primary -mb-[1px]'
                                    : 'text-text_four hover:text-text_one'
                            }`}
                        >
                            Offers Received ({receivedBids.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('watchlist')}
                            className={`px-4 py-2 typo-body_lr transition-all ${
                                activeTab === 'watchlist'
                                    ? 'text-primary border-b-2 border-primary -mb-[1px]'
                                    : 'text-text_four hover:text-text_one'
                            }`}
                        >
                            Watchlist (0)
                        </button>
                    </div>
                </div>

                {activeTab === 'my-offers' && (
                    <div className='flex gap-2 xs:w-full xs:justify-end'>
                        <button
                            onClick={() => setShowBudgetManager(true)}
                            className='px-3 py-2 border border-border_gray rounded-lg typo-body_sr hover:bg-gray-50'
                        >
                            💰 Budget
                        </button>
                        <button
                            onClick={() => setShowNotificationSettings(true)}
                            className='px-3 py-2 border border-border_gray rounded-lg typo-body_sr hover:bg-gray-50'
                        >
                            🔔 Alerts
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-text_four'}`}
                        >
                            List
                        </button>
                        <button
                            onClick={() => setViewMode('card')}
                            className={`px-3 py-2 rounded ${viewMode === 'card' ? 'bg-primary text-white' : 'bg-gray-100 text-text_four'}`}
                        >
                            Cards
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`px-3 py-2 rounded ${viewMode === 'table' ? 'bg-primary text-white' : 'bg-gray-100 text-text_four'}`}
                        >
                            Table
                        </button>
                    </div>
                )}
            </div>

            {/* MY BIDS TAB */}
            {activeTab === 'my-offers' && (
                <>
                    {/* Action Required Section */}
                    {actionRequiredItems.length > 0 && (
                        <div className='bg-accent-coral/5 border-2 border-accent-coral/20 rounded-lg p-4 mb-6 xs:mx-4'>
                            <div className='flex items-center gap-2 mb-3'>
                                <span className='text-2xl'>⚠️</span>
                                <h2 className='typo-body_lm text-accent-coral'>Action Required ({actionRequiredItems.length})</h2>
                            </div>
                            <div className='space-y-2'>
                                {actionRequiredItems.map(item => (
                                    <div key={item.id} className='flex items-center justify-between bg-white rounded-lg p-3'>
                                        <div className='flex items-center gap-3'>
                                            <Image
                                                src={item.auctionItem?.imageUrls?.[0] || '/placeholder-product.svg'}
                                                alt={item.auctionItem?.title || 'item'}
                                                width={48}
                                                height={48}
                                                className='rounded w-12 h-12 object-cover'
                                            />
                                            <div>
                                                <p className='typo-body_lr text-text_one'>{item.auctionItem?.title}</p>
                                                <p className='typo-body_sr text-text_four'>
                                                    {item.status === 'WON' && '🎉 Payment Due - 4 days left'}
                                                    {item.status === 'OUTBID' && `🔴 Outbid by ${formatToNaira((item.auctionDetails?.currentBid || 0) - item.cashAmount)}`}
                                                    {item.status === 'WINNING' && item.auctionDetails?.endDate &&
                                                        `⏰ Ending in ${Math.round((new Date(item.auctionDetails.endDate).getTime() - Date.now()) / (1000 * 60))} minutes`}
                                                    {item.status === 'ACCEPTED' && '💳 Proceed to Payment'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedBidId(item.id)}
                                            className={`px-4 py-2 text-white rounded-lg typo-body_sr transition-all ${
                                                item.status === 'WON' || item.status === 'ACCEPTED'
                                                    ? 'bg-primary-light hover:bg-primary-light/90'
                                                    : 'bg-primary hover:bg-primary/90'
                                            }`}
                                        >
                                            {item.status === 'WON' || item.status === 'ACCEPTED' ? 'Pay Now' : 'Take Action'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Stats Dashboard */}
                    <div className='grid grid-cols-6 xs:grid-cols-2 gap-4 mb-6 xs:mx-4'>
                        <div className='bg-white p-4 rounded-lg shadow'>
                            <div className='typo-body_sr text-text_four'>Total Offers</div>
                            <div className='typo-heading_sm text-text_one mt-1'>{myBidsStats.totalBids}</div>
                        </div>
                        <div className='bg-white p-4 rounded-lg shadow'>
                            <div className='typo-body_sr text-text_four'>Active</div>
                            <div className='typo-heading_sm text-text_one mt-1'>{myBidsStats.activeBids}</div>
                        </div>
                        <div className='bg-white p-4 rounded-lg shadow'>
                            <div className='typo-body_sr text-text_four'>Won</div>
                            <div className='typo-heading_sm text-text_one mt-1'>{myBidsStats.wonBids}</div>
                        </div>
                        <div className='bg-white p-4 rounded-lg shadow'>
                            <div className='typo-body_sr text-text_four'>Win Rate</div>
                            <div className='typo-heading_sm text-text_one mt-1'>{myBidsStats.winRate}%</div>
                        </div>
                        <div className='bg-white p-4 rounded-lg shadow xs:col-span-2'>
                            <div className='typo-body_sr text-text_four'>Total Spent</div>
                            <div className='typo-heading_sm text-text_one mt-1'>{formatToNaira(myBidsStats.totalSpent)}</div>
                        </div>
                        <div className='bg-white p-4 rounded-lg shadow xs:col-span-2'>
                            <div className='typo-body_sr text-text_four'>Saved (Max - Won)</div>
                            <div className='typo-heading_sm text-text_one mt-1'>{formatToNaira(myBidsStats.totalSaved)}</div>
                        </div>
                    </div>

                    {/* Budget Progress */}
                    <div className='bg-white shadow-lg xs:shadow-none p-4 mb-4 xs:mx-4 rounded-lg'>
                        <div className='flex justify-between items-center mb-2'>
                            <span className='typo-body_lr text-text_four'>Budget Usage</span>
                            <span className='typo-body_lr text-text_one'>
                                {formatToNaira(myBidsStats.totalSpent)} / {formatToNaira(budget)}
                            </span>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-3'>
                            <div
                                className={`h-3 rounded-full transition-all ${
                                    (myBidsStats.totalSpent / budget) * 100 > 90 ? 'bg-error' :
                                    (myBidsStats.totalSpent / budget) * 100 > 70 ? 'bg-warning' : 'bg-primary'
                                }`}
                                style={{width: `${Math.min((myBidsStats.totalSpent / budget) * 100, 100)}%`}}
                            />
                        </div>
                        <div className='typo-body_sr text-text_four mt-1'>
                            {Math.round((myBidsStats.totalSpent / budget) * 100)}% of budget used · {formatToNaira(budget - myBidsStats.totalSpent)} remaining
                        </div>
                    </div>

                    {/* Filters and Sorting */}
                    <div className='bg-white shadow-lg xs:shadow-none p-4 mb-4 xs:mx-4 rounded-lg'>
                        <div className='flex xs:flex-col gap-4'>
                            <div className='flex-1'>
                                <label className='typo-body_sr text-text_four mb-2 block'>Filter by Status</label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                                    className='w-full h-[44px] px-3 border border-border_gray rounded-lg typo-body_mr'
                                >
                                    <option value='ALL'>All Statuses</option>
                                    <option value='PENDING'>Pending</option>
                                    <option value='ACCEPTED'>Accepted</option>
                                    <option value='REJECTED'>Rejected</option>
                                    <option value='WINNING'>Winning (Auction)</option>
                                    <option value='OUTBID'>Outbid (Auction)</option>
                                    <option value='WON'>Won (Auction)</option>
                                    <option value='LOST'>Lost (Auction)</option>
                                    <option value='PAID'>Paid</option>
                                    <option value='IN_PROGRESS'>In Progress</option>
                                    <option value='DELIVERED'>Delivered</option>
                                    <option value='COMPLETED'>Completed</option>
                                    <option value='CANCELLED'>Cancelled</option>
                                    <option value='EXPIRED'>Expired</option>
                                </select>
                            </div>

                            <div className='flex-1'>
                                <label className='typo-body_sr text-text_four mb-2 block'>Sort by</label>
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                                    className='w-full h-[44px] px-3 border border-border_gray rounded-lg typo-body_mr'
                                >
                                    <option value='status-priority'>Priority (Action Required First)</option>
                                    <option value='date-desc'>Newest First</option>
                                    <option value='date-asc'>Oldest First</option>
                                    <option value='amount-desc'>Highest Amount</option>
                                    <option value='amount-asc'>Lowest Amount</option>
                                </select>
                            </div>
                        </div>

                        <div className='mt-3 typo-body_sr text-text_four'>
                            Showing {filteredAndSortedBids.length} of {myBids.length} offers
                        </div>
                    </div>

                    {/* Bids List */}
                    {filteredAndSortedBids.length ? (
                        <div className={`shadow-lg xs:shadow-transparent bg-white rounded-lg p-6 xs:p-4 ${
                            viewMode === 'card' ? 'space-y-6' : viewMode === 'table' ? '' : 'space-y-4'
                        }`}>
                            {/* Card View */}
                            {viewMode === 'card' && filteredAndSortedBids.map((bid) => {
                                const imageUrl = bid.auctionItem?.imageUrls?.[0] || '/placeholder-product.svg';
                                const isAuction = bid.auctionDetails?.isAuction;
                                const hasMaxBid = bid.maxBid && bid.maxBid > bid.cashAmount;

                                return (
                                    <div
                                        key={bid.id}
                                        className={`border rounded-lg p-4 card-hover cursor-pointer ${
                                            bid.actionRequired ? 'border-accent-coral/30 bg-accent-coral/5' : 'border-border_gray'
                                        }`}
                                    >
                                        {bid.actionRequired && (
                                            <div className='flex items-center gap-2 mb-3 text-accent-coral typo-body_sm'>
                                                <span className='text-lg'>⚠️</span>
                                                <span>Action Required</span>
                                            </div>
                                        )}

                                        <div className='flex gap-4 xs:flex-col'>
                                            <Image
                                                src={imageUrl}
                                                alt={bid.auctionItem?.title || 'item'}
                                                width={120}
                                                height={120}
                                                className='rounded-lg object-cover w-[120px] h-[120px] xs:w-full xs:h-[200px]'
                                            />

                                            <div className='flex-1'>
                                                <div className='flex items-start justify-between gap-4 xs:flex-col'>
                                                    <div className='flex-1'>
                                                        <h3 className='typo-body_lm text-text_one mb-1'>
                                                            {bid.auctionItem?.title}
                                                        </h3>
                                                        <div className='flex items-center gap-2 mb-2 flex-wrap'>
                                                            <span className={`px-3 py-1 rounded typo-body_sr border ${getStatusStyle(bid.status)}`}>
                                                                {bid.status}
                                                            </span>
                                                            {isAuction && (
                                                                <span className='px-3 py-1 bg-accent-navy/10 text-accent-navy rounded typo-body_sr'>
                                                                    Auction
                                                                </span>
                                                            )}
                                                            {bid.bidPosition && (
                                                                <span className='px-2 py-1 bg-gray-100 text-text_four rounded typo-body_sr'>
                                                                    #{bid.bidPosition} of {bid.auctionDetails?.totalBids}
                                                                </span>
                                                            )}
                                                            {bid.watchers && (
                                                                <span className='typo-body_sr text-text_four'>
                                                                    👁️ {bid.watchers} watching
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className='text-right xs:text-left xs:w-full'>
                                                        <div className='typo-body_sr text-text_four'>Your Bid</div>
                                                        <div className='typo-heading_ss text-primary'>{formatToNaira(bid.cashAmount)}</div>
                                                        {hasMaxBid && (
                                                            <div className='typo-body_sr text-primary mt-1'>
                                                                Max: {formatToNaira(bid.maxBid!)}
                                                            </div>
                                                        )}
                                                        {isAuction && bid.auctionDetails && (
                                                            <div className='typo-body_sr text-text_four mt-1'>
                                                                Current: {formatToNaira(bid.auctionDetails.currentBid)}
                                                            </div>
                                                        )}
                                                        {bid.bidPosition && bid.bidPosition > 1 && bid.auctionDetails && (
                                                            <div className='typo-body_sr text-warning mt-1'>
                                                                To win: +{formatToNaira(bid.auctionDetails.currentBid - bid.cashAmount + bid.auctionDetails.bidIncrement!)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className='flex items-center gap-2 mt-3 mb-3'>
                                                    <Image
                                                        src={bid.auctionItem?.seller?.avatar || '/placeholder-avatar.svg'}
                                                        alt='seller'
                                                        width={32}
                                                        height={32}
                                                        className='rounded-full w-8 h-8 object-cover'
                                                    />
                                                    <div>
                                                        <div className='typo-body_sr text-text_one'>
                                                            {bid.auctionItem?.seller?.firstName} {bid.auctionItem?.seller?.lastName}
                                                        </div>
                                                        <StarRating rating={bid.auctionItem?.seller?.avg_rating || 0} size={12} />
                                                    </div>
                                                </div>

                                                {isAuction && bid.auctionDetails?.endDate && new Date(bid.auctionDetails.endDate) > new Date() && (
                                                    <div className='bg-surface-secondary p-3 rounded-lg mb-3'>
                                                        <div className='typo-body_sr text-text_four mb-1'>Time Remaining</div>
                                                        <CountdownTimer endTime={new Date(bid.auctionDetails.endDate)} />
                                                    </div>
                                                )}

                                                <div className='flex items-center gap-4 typo-body_sr text-text_four mb-3'>
                                                    <span>Placed {timeAgo(bid.dateCreated)}</span>
                                                    {isAuction && <span>{bid.auctionDetails?.totalBids} total bids</span>}
                                                </div>

                                                <div className='flex gap-2 xs:flex-col'>
                                                    <button
                                                        onClick={() => setSelectedBidId(bid.id)}
                                                        className='px-4 py-2 bg-primary text-white rounded-lg typo-body_sr hover:bg-primary/90'
                                                    >
                                                        View Details
                                                    </button>

                                                    {(bid.status === 'OUTBID' || bid.status === 'WINNING') && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedBidForMaxBid(bid.id);
                                                                setMaxBidAmount('');
                                                                setShowMaxBidModal(true);
                                                            }}
                                                            className='px-4 py-2 bg-primary text-white rounded-lg typo-body_sr hover:bg-primary/90 transition-all'
                                                        >
                                                            {hasMaxBid ? 'Update Max Bid' : 'Set Max Bid'}
                                                        </button>
                                                    )}

                                                    {bid.status === 'WON' && (
                                                        <Link href={`/transaction/${bid.id}?type=auction`}>
                                                            <button className='px-4 py-2 bg-primary-light text-white rounded-lg typo-body_sr hover:bg-primary-light/90 transition-all w-full'>
                                                                Pay Now
                                                            </button>
                                                        </Link>
                                                    )}

                                                    {bid.status === 'ACCEPTED' && (
                                                        <Link href={`/transaction/${bid.id}`}>
                                                            <button className='px-4 py-2 bg-primary-light text-white rounded-lg typo-body_sr hover:bg-primary-light/90 transition-all w-full'>
                                                                Proceed to Payment
                                                            </button>
                                                        </Link>
                                                    )}

                                                    {bid.status === 'OUTBID' && (
                                                        <button className='px-4 py-2 bg-accent-coral text-white rounded-lg typo-body_sr hover:bg-accent-coral/90 transition-all'>
                                                            Increase Bid
                                                        </button>
                                                    )}

                                                    <Link href={`/${bid.auctionItem?.id}`}>
                                                        <button className='px-4 py-2 border border-border_gray text-text_one rounded-lg typo-body_sr hover:bg-gray-50 w-full'>
                                                            View Item
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* List View - Existing code... */}
                            {viewMode === 'list' && filteredAndSortedBids.map((bid) => {
                                const imageUrl = bid.auctionItem?.imageUrls?.[0] || '/placeholder-product.svg';
                                return (
                                    <div
                                        key={bid.id}
                                        onClick={() => setSelectedBidId(bid.id)}
                                        className='flex items-center border border-border_gray rounded-lg p-3 card-hover-subtle cursor-pointer'
                                    >
                                        <Image
                                            src={imageUrl}
                                            height={64}
                                            width={64}
                                            alt={bid.auctionItem?.title || 'item'}
                                            className='mr-4 rounded h-16 w-16 object-cover'
                                        />
                                        <div className='flex-1'>
                                            <div className='flex items-center gap-2'>
                                                <p className='text-primary typo-body_ls'>{bid.auctionItem?.title}</p>
                                                <span className={`px-2 py-1 rounded typo-body_sr ${getStatusStyle(bid.status)}`}>
                                                    {bid.status}
                                                </span>
                                            </div>
                                            <p className='typo-body_mr text-text_one'>
                                                Your bid: {formatToNaira(bid.cashAmount)}
                                                {bid.maxBid && <span className='text-primary'> (Max: {formatToNaira(bid.maxBid)})</span>}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Table View - Existing code... */}
                            {viewMode === 'table' && (
                                <div className='overflow-x-auto'>
                                    <table className='w-full'>
                                        <thead className='bg-gray-50'>
                                            <tr>
                                                <th className='px-4 py-3 text-left typo-body_sm text-text_four'>Item</th>
                                                <th className='px-4 py-3 text-left typo-body_sm text-text_four'>Your Bid</th>
                                                <th className='px-4 py-3 text-left typo-body_sm text-text_four'>Max Bid</th>
                                                <th className='px-4 py-3 text-left typo-body_sm text-text_four'>Status</th>
                                                <th className='px-4 py-3 text-left typo-body_sm text-text_four'>Date</th>
                                                <th className='px-4 py-3 text-left typo-body_sm text-text_four'>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredAndSortedBids.map((bid) => (
                                                <tr key={bid.id} className='border-b border-border_gray hover:bg-surface-primary transition-colors cursor-pointer'>
                                                    <td className='px-4 py-3'>
                                                        <div className='flex items-center gap-3'>
                                                            <Image
                                                                src={bid.auctionItem?.imageUrls?.[0] || '/placeholder-product.svg'}
                                                                alt={bid.auctionItem?.title || 'item'}
                                                                width={48}
                                                                height={48}
                                                                className='rounded w-12 h-12 object-cover'
                                                            />
                                                            <span className='typo-body_mr'>{bid.auctionItem?.title}</span>
                                                        </div>
                                                    </td>
                                                    <td className='px-4 py-3 typo-body_mr text-primary'>
                                                        {formatToNaira(bid.cashAmount)}
                                                    </td>
                                                    <td className='px-4 py-3 typo-body_mr text-primary'>
                                                        {bid.maxBid ? formatToNaira(bid.maxBid) : '-'}
                                                    </td>
                                                    <td className='px-4 py-3'>
                                                        <span className={`px-3 py-1 rounded typo-body_sr ${getStatusStyle(bid.status)}`}>
                                                            {bid.status}
                                                        </span>
                                                    </td>
                                                    <td className='px-4 py-3 typo-body_sr text-text_four'>
                                                        {timeAgo(bid.dateCreated)}
                                                    </td>
                                                    <td className='px-4 py-3'>
                                                        <button
                                                            onClick={() => setSelectedBidId(bid.id)}
                                                            className='text-primary typo-body_sr hover:underline'
                                                        >
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ) : (
                        <NoData text='No offers match your filters' />
                    )}
                </>
            )}

            {/* RECEIVED BIDS TAB */}
            {activeTab === 'received-offers' && (
                <>
                    {/* Stats Dashboard for Received Bids */}
                    <div className='grid grid-cols-4 xs:grid-cols-2 gap-4 mb-6 xs:mx-4'>
                        <div className='bg-white p-4 rounded-lg shadow'>
                            <div className='typo-body_sr text-text_four'>Total Offers</div>
                            <div className='typo-heading_sm text-text_one mt-1'>{receivedBidsStats.totalBids}</div>
                        </div>
                        <div className='bg-white p-4 rounded-lg shadow'>
                            <div className='typo-body_sr text-text_four'>Active Offers</div>
                            <div className='typo-heading_sm text-text_one mt-1'>{receivedBidsStats.activeBids}</div>
                        </div>
                        <div className='bg-white p-4 rounded-lg shadow xs:col-span-2'>
                            <div className='typo-body_sr text-text_four'>Potential Revenue</div>
                            <div className='typo-heading_sm text-text_one mt-1'>{formatToNaira(receivedBidsStats.totalRevenue)}</div>
                        </div>
                        <div className='bg-white p-4 rounded-lg shadow xs:col-span-2'>
                            <div className='typo-body_sr text-text_four'>Average Bid</div>
                            <div className='typo-heading_sm text-text_one mt-1'>{formatToNaira(receivedBidsStats.averageBid)}</div>
                        </div>
                    </div>

                    {/* Received Bids List */}
                    {receivedBids.length > 0 ? (
                        <div className='shadow-lg xs:shadow-transparent bg-white rounded-lg p-6 xs:p-4 space-y-4'>
                            {receivedBids.map((bid) => (
                                <div
                                    key={bid.id}
                                    className='border border-border_gray rounded-lg p-4 card-hover cursor-pointer'
                                >
                                    <div className='flex gap-4 xs:flex-col'>
                                        <Image
                                            src={bid.item.imageUrl}
                                            alt={bid.item.title}
                                            width={120}
                                            height={120}
                                            className='rounded-lg object-cover w-[120px] h-[120px] xs:w-full xs:h-[200px]'
                                        />

                                        <div className='flex-1'>
                                            <div className='flex items-start justify-between gap-4 xs:flex-col'>
                                                <div className='flex-1'>
                                                    <h3 className='typo-body_lm text-text_one mb-1'>{bid.item.title}</h3>
                                                    <div className='flex items-center gap-2 mb-3'>
                                                        <span className={`px-3 py-1 rounded typo-body_sr border ${
                                                            bid.isHighest ? 'bg-surface-primary text-primary border-primary/20' : getStatusStyle(bid.status)
                                                        }`}>
                                                            {bid.isHighest ? 'Highest Bid' : bid.status}
                                                        </span>
                                                        {bid.item.isAuction && (
                                                            <span className='px-3 py-1 bg-accent-navy/10 text-accent-navy rounded typo-body_sr'>
                                                                Auction
                                                            </span>
                                                        )}
                                                        {bid.item.reservePrice && (
                                                            <span className={`px-2 py-1 rounded typo-body_sr ${
                                                                bid.item.reserveMet ? 'bg-surface-primary text-primary' : 'bg-surface-secondary text-warning'
                                                            }`}>
                                                                {bid.item.reserveMet ? '✓ Reserve Met' : 'Reserve Not Met'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className='text-right xs:text-left xs:w-full'>
                                                    <div className='typo-body_sr text-text_four'>Bid Amount</div>
                                                    <div className='typo-heading_ss text-primary'>{formatToNaira(bid.bidAmount)}</div>
                                                    <div className='typo-body_sr text-text_four mt-1'>
                                                        Current: {formatToNaira(bid.item.currentBid)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='flex items-center gap-2 mb-3'>
                                                <Image
                                                    src={bid.bidder.avatar}
                                                    alt={bid.bidder.name}
                                                    width={32}
                                                    height={32}
                                                    className='rounded-full w-8 h-8 object-cover'
                                                />
                                                <div>
                                                    <div className='flex items-center gap-2'>
                                                        <span className='typo-body_sr text-text_one'>{bid.bidder.name}</span>
                                                        {bid.bidder.verified && (
                                                            <Image src='/verified.svg' alt='verified' width={14} height={14} />
                                                        )}
                                                    </div>
                                                    <StarRating rating={bid.bidder.rating} size={12} />
                                                </div>
                                            </div>

                                            {bid.item.endDate && new Date(bid.item.endDate) > new Date() && (
                                                <div className='bg-surface-secondary p-3 rounded-lg mb-3'>
                                                    <div className='typo-body_sr text-text_four mb-1'>Time Remaining</div>
                                                    <CountdownTimer endTime={new Date(bid.item.endDate)} />
                                                </div>
                                            )}

                                            <div className='flex items-center gap-4 typo-body_sr text-text_four mb-3'>
                                                <span>Received {timeAgo(bid.dateCreated)}</span>
                                                <span>{bid.item.totalBids} total bids</span>
                                            </div>

                                            <div className='flex gap-2 xs:flex-col'>
                                                <Link href={`/manage-item/${bid.item.id}`}>
                                                    <button className='px-4 py-2 bg-primary text-white rounded-lg typo-body_sr hover:bg-primary/90 w-full'>
                                                        Manage Item
                                                    </button>
                                                </Link>
                                                <button className='px-4 py-2 bg-primary text-white rounded-lg typo-body_sr hover:bg-primary/90 transition-all'>
                                                    Accept Bid
                                                </button>
                                                <button className='px-4 py-2 border border-border_gray text-text_one rounded-lg typo-body_sr hover:bg-gray-50'>
                                                    Reject
                                                </button>
                                                <button className='px-4 py-2 border border-border_gray text-text_one rounded-lg typo-body_sr hover:bg-gray-50'>
                                                    Counter Offer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <NoData text='No offers received on your items yet' />
                    )}
                </>
            )}

            {/* WATCHLIST TAB */}
            {activeTab === 'watchlist' && (
                <div className='shadow-lg xs:shadow-transparent bg-white rounded-lg p-6 xs:p-4'>
                    <NoData text='No items in your watchlist. Start watching items to track them!' />
                </div>
            )}

            {/* Budget Manager Modal */}
            {showBudgetManager && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
                    <div className='bg-white rounded-lg p-6 max-w-md w-full'>
                        <h2 className='typo-heading_ss mb-4'>Budget Manager</h2>
                        <p className='typo-body_mr text-text_four mb-4'>
                            Set your maximum spending budget to prevent overspending on bids.
                        </p>
                        <label className='typo-body_lr text-text_one mb-2 block'>Monthly Budget</label>
                        <input
                            type='number'
                            value={budget}
                            onChange={(e) => setBudget(parseInt(e.target.value))}
                            className='w-full h-[51px] px-4 border border-border_gray rounded-lg typo-body_mr mb-4'
                        />
                        <div className='flex gap-3'>
                            <button
                                onClick={() => setShowBudgetManager(false)}
                                className='flex-1 px-4 py-2 border border-border_gray text-text_one rounded-lg typo-body_lr hover:bg-gray-50'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowBudgetManager(false)}
                                className='flex-1 px-4 py-2 bg-primary text-white rounded-lg typo-body_lr hover:bg-primary/90'
                            >
                                Save Budget
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Max Bid Modal */}
            {showMaxBidModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
                    <div className='bg-white rounded-lg p-6 max-w-md w-full'>
                        <h2 className='typo-heading_ss mb-4'>Set Maximum Bid</h2>
                        <p className='typo-body_mr text-text_four mb-4'>
                            We&apos;ll automatically bid on your behalf up to your maximum amount. You&apos;ll only pay the minimum needed to win.
                        </p>
                        <label className='typo-body_lr text-text_one mb-2 block'>Maximum Bid Amount</label>
                        <input
                            type='number'
                            value={maxBidAmount}
                            onChange={(e) => setMaxBidAmount(e.target.value)}
                            placeholder='Enter your maximum bid'
                            className='w-full h-[51px] px-4 border border-border_gray rounded-lg typo-body_mr mb-4'
                        />
                        <div className='bg-surface-primary p-3 rounded-lg mb-4'>
                            <p className='typo-body_sr text-primary'>
                                💡 Tip: Set your true maximum. Our system will bid incrementally to keep you competitive.
                            </p>
                        </div>
                        <div className='flex gap-3'>
                            <button
                                onClick={() => {
                                    setShowMaxBidModal(false);
                                    setSelectedBidForMaxBid(null);
                                }}
                                className='flex-1 px-4 py-2 border border-border_gray text-text_one rounded-lg typo-body_lr hover:bg-gray-50'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    // Handle max bid submission
                                    setShowMaxBidModal(false);
                                    setSelectedBidForMaxBid(null);
                                }}
                                className='flex-1 px-4 py-2 bg-primary text-white rounded-lg typo-body_lr hover:bg-primary/90'
                            >
                                Set Max Bid
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Settings Modal */}
            {showNotificationSettings && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
                    <div className='bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto'>
                        <h2 className='typo-heading_ss mb-4'>Notification Settings</h2>

                        <div className='space-y-4'>
                            <div className='border-b border-border_gray pb-3'>
                                <h3 className='typo-body_lm mb-2'>Critical Alerts</h3>
                                <label className='flex items-center justify-between mb-2'>
                                    <span className='typo-body_mr'>Outbid Notifications</span>
                                    <input type='checkbox' defaultChecked className='w-5 h-5' />
                                </label>
                                <label className='flex items-center justify-between mb-2'>
                                    <span className='typo-body_mr'>Auction Ending Soon (1hr)</span>
                                    <input type='checkbox' defaultChecked className='w-5 h-5' />
                                </label>
                                <label className='flex items-center justify-between mb-2'>
                                    <span className='typo-body_mr'>Won Auction</span>
                                    <input type='checkbox' defaultChecked className='w-5 h-5' />
                                </label>
                                <label className='flex items-center justify-between'>
                                    <span className='typo-body_mr'>Payment Deadline (24h)</span>
                                    <input type='checkbox' defaultChecked className='w-5 h-5' />
                                </label>
                            </div>

                            <div className='border-b border-border_gray pb-3'>
                                <h3 className='typo-body_lm mb-2'>Informational</h3>
                                <label className='flex items-center justify-between mb-2'>
                                    <span className='typo-body_mr'>Daily Digest</span>
                                    <input type='checkbox' defaultChecked className='w-5 h-5' />
                                </label>
                                <label className='flex items-center justify-between mb-2'>
                                    <span className='typo-body_mr'>Similar Items</span>
                                    <input type='checkbox' className='w-5 h-5' />
                                </label>
                                <label className='flex items-center justify-between'>
                                    <span className='typo-body_mr'>Price Drops</span>
                                    <input type='checkbox' className='w-5 h-5' />
                                </label>
                            </div>

                            <div>
                                <h3 className='typo-body_lm mb-2'>Delivery Method</h3>
                                <label className='flex items-center mb-2'>
                                    <input type='checkbox' defaultChecked className='w-5 h-5 mr-2' />
                                    <span className='typo-body_mr'>Push Notifications</span>
                                </label>
                                <label className='flex items-center mb-2'>
                                    <input type='checkbox' defaultChecked className='w-5 h-5 mr-2' />
                                    <span className='typo-body_mr'>Email</span>
                                </label>
                                <label className='flex items-center'>
                                    <input type='checkbox' className='w-5 h-5 mr-2' />
                                    <span className='typo-body_mr'>SMS</span>
                                </label>
                            </div>
                        </div>

                        <div className='flex gap-3 mt-6'>
                            <button
                                onClick={() => setShowNotificationSettings(false)}
                                className='flex-1 px-4 py-2 border border-border_gray text-text_one rounded-lg typo-body_lr hover:bg-gray-50'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowNotificationSettings(false)}
                                className='flex-1 px-4 py-2 bg-primary text-white rounded-lg typo-body_lr hover:bg-primary/90'
                            >
                                Save Settings
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bid Detail Modal (existing) */}
            {selectedBid && (
                <div
                    className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'
                    onClick={() => setSelectedBidId(null)}
                >
                    <div
                        className='bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='typo-heading_ss'>Bid Details</h2>
                            <button
                                onClick={() => setSelectedBidId(null)}
                                className='text-text_four hover:text-text_one text-2xl'
                            >
                                ×
                            </button>
                        </div>

                        <div className='mb-6'>
                            <Image
                                src={selectedBid.auctionItem?.imageUrls?.[0] || '/placeholder-product.svg'}
                                alt={selectedBid.auctionItem?.title || 'item'}
                                width={600}
                                height={400}
                                className='w-full h-64 object-cover rounded-lg mb-4'
                            />
                            <h3 className='typo-heading_ss mb-2'>{selectedBid.auctionItem?.title}</h3>
                            <p className='typo-body_mr text-text_four mb-4'>{selectedBid.auctionItem?.description}</p>
                        </div>

                        <div className='space-y-4 mb-6'>
                            <div className='flex justify-between'>
                                <span className='typo-body_lr text-text_four'>Your Bid:</span>
                                <span className='typo-body_lm text-primary'>{formatToNaira(selectedBid.cashAmount)}</span>
                            </div>
                            {selectedBid.maxBid && (
                                <div className='flex justify-between'>
                                    <span className='typo-body_lr text-text_four'>Max Bid:</span>
                                    <span className='typo-body_lm text-green-600'>{formatToNaira(selectedBid.maxBid)}</span>
                                </div>
                            )}
                            <div className='flex justify-between'>
                                <span className='typo-body_lr text-text_four'>Status:</span>
                                <span className={`px-3 py-1 rounded typo-body_sr ${getStatusStyle(selectedBid.status)}`}>
                                    {selectedBid.status}
                                </span>
                            </div>
                            <div className='flex justify-between'>
                                <span className='typo-body_lr text-text_four'>Placed:</span>
                                <span className='typo-body_lr'>{timeAgo(selectedBid.dateCreated)}</span>
                            </div>
                            {selectedBid.auctionDetails?.isAuction && (
                                <>
                                    <div className='flex justify-between'>
                                        <span className='typo-body_lr text-text_four'>Current Bid:</span>
                                        <span className='typo-body_lr'>{formatToNaira(selectedBid.auctionDetails.currentBid)}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='typo-body_lr text-text_four'>Total Offers:</span>
                                        <span className='typo-body_lr'>{selectedBid.auctionDetails.totalBids}</span>
                                    </div>
                                    {selectedBid.bidPosition && (
                                        <div className='flex justify-between'>
                                            <span className='typo-body_lr text-text_four'>Your Position:</span>
                                            <span className='typo-body_lr'>#{selectedBid.bidPosition}</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Bid History Timeline */}
                        {selectedBid.bidHistory && selectedBid.bidHistory.length > 0 && (
                            <div className='border-t border-border_gray pt-4 mb-6'>
                                <div className='typo-body_lm mb-3'>Bid Activity Timeline</div>
                                <div className='space-y-3'>
                                    {selectedBid.bidHistory.map((historyItem, index) => (
                                        <div key={index} className='flex items-start gap-3'>
                                            <div className='w-2 h-2 bg-primary rounded-full mt-2'></div>
                                            <div className='flex-1'>
                                                <div className='flex justify-between'>
                                                    <span className='typo-body_lr text-text_one'>{historyItem.bidder}</span>
                                                    <span className='typo-body_sr text-text_four'>{timeAgo(historyItem.time)}</span>
                                                </div>
                                                <div className='typo-body_sr text-primary'>{formatToNaira(historyItem.amount)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className='border-t border-border_gray pt-4 mb-6'>
                            <div className='typo-body_lm mb-3'>Seller Information</div>
                            <div className='flex items-center gap-3'>
                                <Image
                                    src={selectedBid.auctionItem?.seller?.avatar || '/placeholder-avatar.svg'}
                                    alt='seller'
                                    width={48}
                                    height={48}
                                    className='rounded-full w-12 h-12 object-cover'
                                />
                                <div>
                                    <div className='typo-body_lr'>
                                        {selectedBid.auctionItem?.seller?.firstName} {selectedBid.auctionItem?.seller?.lastName}
                                    </div>
                                    <StarRating rating={selectedBid.auctionItem?.seller?.avg_rating || 0} size={14} />
                                </div>
                            </div>
                        </div>

                        <div className='flex gap-3'>
                            <Link href={`/${selectedBid.auctionItem?.id}`} className='flex-1'>
                                <RegularButton text='View Item' isLight />
                            </Link>
                            {selectedBid.status === 'WON' && (
                                <Link href={`/transaction/${selectedBid.id}?type=auction`} className='flex-1'>
                                    <RegularButton text='Pay Now' useLightTeal />
                                </Link>
                            )}
                            {selectedBid.status === 'ACCEPTED' && (
                                <Link href={`/transaction/${selectedBid.id}`} className='flex-1'>
                                    <RegularButton text='Proceed to Payment' useLightTeal />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Offers;
