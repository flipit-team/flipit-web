import {redirect} from 'next/navigation';
import React from 'react';
import GridItems from '~/ui/common/grid-items/GridItems';

const page = () => {
    try {
        const data = [
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
        return (
            <div className='grid-sizes xs:w-full pr-[60px]'>
                <div className='py-9 xs:pt-6 xs:py-0 xs:mb-4 typo-heading_ms'>My Items</div>
                <GridItems items={data} forEdit />
            </div>
        );
    } catch {
        redirect('/error-page');
    }
};

export default page;
