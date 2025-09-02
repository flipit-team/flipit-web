import { MyItem, TabType } from '../types';

export const mockItems: Record<TabType, MyItem[]> = {
    auction: [
        {
            id: 1,
            title: 'iPhone 14 Pro Max - 256GB Space Black',
            image: '/camera.png',
            amount: 850000,
            views: 45,
            type: 'auction'
        },
        {
            id: 2,
            title: 'MacBook Pro 16" M2 - Silver',
            image: '/camera.png',
            amount: 1200000,
            views: 32,
            type: 'auction'
        },
        {
            id: 3,
            title: 'Canon EOS R5 Camera with 24-70mm Lens',
            image: '/camera.png',
            amount: 950000,
            views: 67,
            type: 'auction'
        }
    ],
    listed: [
        {
            id: 4,
            title: 'Gaming Chair - Ergonomic Design',
            image: '/camera.png',
            amount: 75000,
            views: 23,
            type: 'listed'
        },
        {
            id: 5,
            title: 'Samsung 65" 4K Smart TV',
            image: '/camera.png',
            amount: 450000,
            views: 89,
            type: 'listed'
        },
        {
            id: 6,
            title: 'PlayStation 5 Console Bundle',
            image: '/camera.png',
            amount: 320000,
            views: 156,
            type: 'listed'
        }
    ],
    deactivated: [
        {
            id: 7,
            title: 'Vintage Leather Jacket - Size L',
            image: '/camera.png',
            amount: 25000,
            views: 12,
            type: 'deactivated'
        },
        {
            id: 8,
            title: 'HP Laptop - Core i7 16GB RAM',
            image: '/camera.png',
            amount: 180000,
            views: 8,
            type: 'deactivated'
        },
        {
            id: 9,
            title: 'Electric Guitar - Fender Stratocaster',
            image: '/camera.png',
            amount: 95000,
            views: 5,
            type: 'deactivated'
        }
    ]
};