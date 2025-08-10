'use client';
import {useState} from 'react';
import TabNavigation from './TabNavigation';
import ItemCard from './ItemCard';
import NoData from '~/ui/common/no-data/NoData';
import {MyItem, TabType, Tab} from '../types';

interface ItemsContainerProps {
    mockItems: Record<TabType, MyItem[]>;
}

export default function ItemsContainer({mockItems}: ItemsContainerProps) {
    const [activeTab, setActiveTab] = useState<TabType>('auction');

    const tabs: Tab[] = [
        {id: 'auction', label: 'Auction Items'},
        {id: 'listed', label: 'Listed Items'},
        {id: 'deactivated', label: 'Deactivated Items'}
    ];

    const getCurrentItems = (): MyItem[] => {
        return mockItems[activeTab] || [];
    };

    const currentItems = getCurrentItems();

    return (
        <>
            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {currentItems.length > 0 ? (
                <div className='mb-8'>
                    <div className='shadow-lg drop-shadow-lg rounded-lg p-[18px] bg-white border border-gray-100'>
                        <div className='space-y-4'>
                            {currentItems.map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <NoData text={`No ${activeTab} items found`} />
            )}
        </>
    );
}
