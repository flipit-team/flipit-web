'use client';
import {useState, useCallback} from 'react';
import TabNavigation from './TabNavigation';
import ItemCard from './ItemCard';
import NoData from '~/ui/common/no-data/NoData';
import {MyItem, TabType, Tab} from '../types';

interface ItemsContainerProps {
    initialItems: Record<TabType, MyItem[]>;
    onRefreshItems?: () => void;
}

export default function ItemsContainer({initialItems, onRefreshItems}: ItemsContainerProps) {
    const [activeTab, setActiveTab] = useState<TabType>('auction');
    const [items, setItems] = useState<Record<TabType, MyItem[]>>(initialItems);

    const tabs: Tab[] = [
        {id: 'auction', label: 'Auction Items'},
        {id: 'listed', label: 'Listed Items'},
        {id: 'deactivated', label: 'Deactivated Items'}
    ];

    const handleItemDeleted = useCallback((itemId: number) => {
        setItems(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].filter(item => item.id !== itemId)
        }));
        onRefreshItems?.();
    }, [activeTab, onRefreshItems]);

    const handleItemUpdated = useCallback((_itemId: number) => {
        // Refresh the items list to reflect any changes
        onRefreshItems?.();
    }, [onRefreshItems]);

    const getCurrentItems = (): MyItem[] => {
        return items[activeTab] || [];
    };

    const currentItems = getCurrentItems();

    return (
        <>
            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {currentItems.length > 0 ? (
                <div className='mb-8'>
                    <div className='hidden sm:block shadow-lg drop-shadow-lg rounded-lg p-[18px] bg-white border border-gray-100'>
                        <div className='space-y-4'>
                            {currentItems.map((item) => (
                                <ItemCard
                                    key={item.id}
                                    item={item}
                                    onItemDeleted={handleItemDeleted}
                                    onItemUpdated={handleItemUpdated}
                                />
                            ))}
                        </div>
                    </div>
                    <div className='block sm:hidden space-y-4'>
                        {currentItems.map((item) => (
                            <ItemCard
                                key={item.id}
                                item={item}
                                onItemDeleted={handleItemDeleted}
                                onItemUpdated={handleItemUpdated}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <NoData text={`No ${activeTab} items found`} />
            )}
        </>
    );
}
