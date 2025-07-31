import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {Suspense} from 'react';
import NoData from '~/ui/common/no-data/NoData';
import MainChats from '~/ui/wrappers/MainChats';
import {Chat} from '~/utils/interface';

const page = async () => {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('userId')?.value;
        const token = cookieStore.get('token')?.value;
        
        console.log('Messages page - userId:', userId);
        console.log('Messages page - token exists:', !!token);
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chats/get-user-chats`, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}; userId=${userId}`
            },
            cache: 'no-store'
        });

        console.log('Messages page - API response status:', res.status);

        const data: {buyer: Chat[]; seller: Chat[]} = await res.json();

        if (!res.ok) {
            console.error('Messages page - API error:', data);
            return <NoData text='Failed to fetch chats' />;
        }
        
        return <MainChats chatData={data} />;
    } catch (error) {
        console.error('Messages page - Error:', error);
        redirect('/error-page');
    }
};

export default page;
