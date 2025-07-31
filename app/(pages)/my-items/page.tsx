import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import React from 'react';
import GridItems from '~/ui/common/grid-items/GridItems';
import NoData from '~/ui/common/no-data/NoData';
import {Chat, Item} from '~/utils/interface';

const page = async () => {
    try {
        const data2 = [
            {
                id: 1,
                title: 'Canon EOS RP Camera +Small Rig | Clean U... ',
                description: 'string',
                imageUrls: ['/camera.png'],
                flipForImgUrls: ['/camera.png'],
                acceptCash: true,
                cashAmount: 5000,
                condition: 'new',
                dateCreated: '' as unknown as Date,
                published: true,
                location: 'string',
                seller: {
                    id: '1',
                    title: 'string',
                    firstName: 'Joe',
                    middleName: 'string',
                    lastName: 'Campos',
                    email: 'campos@gmail.com',
                    phoneNumber: '+23408095864533',
                    avatar: 'string',
                    avg_rating: 0,
                    status: 'string',
                    phoneNumberVerified: true,
                    dateVerified: '' as unknown as Date
                },
                itemCategories: [
                    {
                        name: 'Vehicles',
                        description: 'string'
                    }
                ]
            },
            {
                id: 1,
                title: 'Canon EOS RP Camera +Small Rig | Clean U... ',
                description: 'string',
                imageUrls: ['/camera.png'],
                flipForImgUrls: ['/camera.png'],
                acceptCash: true,
                cashAmount: 5000,
                condition: 'new',
                dateCreated: '' as unknown as Date,
                published: true,
                location: 'string',
                seller: {
                    id: '1',
                    title: 'string',
                    firstName: 'Joe',
                    middleName: 'string',
                    lastName: 'Campos',
                    email: 'campos@gmail.com',
                    phoneNumber: '+23408095864533',
                    avatar: 'string',
                    avg_rating: 0,
                    status: 'string',
                    phoneNumberVerified: true,
                    dateVerified: '' as unknown as Date
                },
                itemCategories: [
                    {
                        name: 'Vehicles',
                        description: 'string'
                    }
                ]
            },
            {
                id: 1,
                title: 'Canon EOS RP Camera +Small Rig | Clean U... ',
                description: 'string',
                imageUrls: ['/camera.png'],
                flipForImgUrls: ['/camera.png'],
                acceptCash: true,
                cashAmount: 5000,
                condition: 'new',
                dateCreated: '' as unknown as Date,
                published: true,
                location: 'string',
                seller: {
                    id: '1',
                    title: 'string',
                    firstName: 'Joe',
                    middleName: 'string',
                    lastName: 'Campos',
                    email: 'campos@gmail.com',
                    phoneNumber: '+23408095864533',
                    avatar: 'string',
                    avg_rating: 0,
                    status: 'string',
                    phoneNumberVerified: true,
                    dateVerified: '' as unknown as Date
                },
                itemCategories: [
                    {
                        name: 'Vehicles',
                        description: 'string'
                    }
                ]
            }
        ];

        const cookieStore = await cookies();
        const userId = cookieStore.get('userId')?.value;
        const token = cookieStore.get('token')?.value;

        console.log('My-items page - userId:', userId);
        console.log('My-items page - token exists:', !!token);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/items/get-user-items?userId=${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}; userId=${userId}`
            },
            cache: 'no-store'
        });

        console.log('My-items page - API response status:', res.status);

        const data: Item[] = await res.json();

        if (!res.ok) {
            console.error('My-items page - API error:', data);
            return <NoData text='Failed to fetch items' />;
        }
        return (
            <div className='grid-sizes xs:w-full pr-[60px]'>
                <div className='py-9 xs:pt-6 xs:py-0 xs:mb-4 typo-heading_ms'>My Items</div>
                <GridItems items={data} forEdit />
            </div>
        );
    } catch (error) {
        console.error('My-items page - Error:', error);
        redirect('/error-page');
    }
};

export default page;
