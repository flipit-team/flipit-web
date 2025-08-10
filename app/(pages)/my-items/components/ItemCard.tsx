'use client';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import Button from '~/ui/common/button';
import {MyItem} from '../types';

interface ItemCardProps {
    item: MyItem;
}

const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0
    }).format(amount);
};

export default function ItemCard({item}: ItemCardProps) {
    const router = useRouter();

    const handleEditItem = () => {
        router.push(`/edit-item/${item.id}`);
    };

    return (
        <div className='w-[833px] h-[179px] border border-border_gray rounded-md flex p-4'>
            <div className='w-[157px] h-full bg-gray-200 rounded-md overflow-hidden flex-shrink-0 relative'>
                <Image src={item.image} alt={item.title} fill className='object-cover' />
            </div>

            <div className='flex-1 ml-[22px] flex flex-col justify-between'>
                <div>
                    <h3 className='text-gray-700 text-[16px] font-normal mb-2'>{item.title}</h3>
                    <div className='text-[#333333] text-[20px] font-medium mb-1'>{formatAmount(item.amount)}</div>
                    <div className='text-gray-700 text-[14px] font-normal'>Views: {item.views}</div>
                </div>

                <div className='flex gap-3 mt-[21px]'>
                    <Button variant='outline' size='sm' onClick={handleEditItem}>
                        Edit Item
                    </Button>
                    <Button variant='outline' size='sm'>
                        Mark as Sold
                    </Button>
                    <Button variant='danger' size='sm'>
                        Delete Item
                    </Button>
                </div>
            </div>
        </div>
    );
}
