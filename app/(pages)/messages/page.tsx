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
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chats/get-user-chats?userId=${userId}`, {
            cache: 'no-store'
        });

        const data: {buyer: Chat[]; seller: Chat[]} = await res.json();

        if (!res.ok) {
            return <NoData text='Failed to fetch items' />;
        }
        return <MainChats chatData={data} />;
    } catch {
        redirect('/error-page');
    }
};

export default page;
