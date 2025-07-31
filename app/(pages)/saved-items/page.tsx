import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import React from 'react';
import GridItems from '~/ui/common/grid-items/GridItems';
import NoData from '~/ui/common/no-data/NoData';
import {Item} from '~/utils/interface';

const page = async () => {
    try {
        // Dummy data for saved items - replace with actual API call
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
                id: 2,
                title: 'Gaming Console PS5 | Like New Condition',
                description: 'string',
                imageUrls: ['/camera.png'],
                flipForImgUrls: ['/camera.png'],
                acceptCash: true,
                cashAmount: 8000,
                condition: 'fairly_used',
                dateCreated: '' as unknown as Date,
                published: true,
                location: 'string',
                seller: {
                    id: '2',
                    title: 'string',
                    firstName: 'Jane',
                    middleName: 'string',
                    lastName: 'Smith',
                    email: 'jane@gmail.com',
                    phoneNumber: '+23408095864533',
                    avatar: 'string',
                    avg_rating: 0,
                    status: 'string',
                    phoneNumberVerified: true,
                    dateVerified: '' as unknown as Date
                },
                itemCategories: [
                    {
                        name: 'Electronics',
                        description: 'string'
                    }
                ]
            }
        ];

        const cookieStore = await cookies();
        const userId = cookieStore.get('userId')?.value;
        
        // For now, using dummy data. Replace with actual saved items API call
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/items/get-saved-items?userId=${userId}`, {
            cache: 'no-store'
        }).catch(() => null);

        // Fallback to dummy data if API fails
        const data: Item[] = res ? await res.json() : data2;

        return (
            <div className='grid-sizes xs:w-full pr-[60px]'>
                <div className='py-9 xs:pt-6 xs:py-0 xs:mb-4 typo-heading_ms'>Saved Items</div>
                {data.length ? <GridItems items={data} /> : <NoData text="No saved items yet" />}
            </div>
        );
    } catch {
        redirect('/error-page');
    }
};

export default page;