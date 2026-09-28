'use client';
import {TabType, Tab} from '../types';

interface TabNavigationProps {
    tabs: Tab[];
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export default function TabNavigation({tabs, activeTab, onTabChange}: TabNavigationProps) {
    return (
        <div className='mb-8'>
            <div className='border-b border-border_gray'>
                <ul className='flex space-x-8 -mb-px overflow-x-auto scrollbar-hide'>
                    {tabs.map((tab) => (
                        <li key={tab.id}>
                            <button
                                onClick={() => onTabChange(tab.id)}
                                className={`inline-block pb-3 px-1 border-b-2 transition-colors duration-200 whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'text-primary border-primary font-medium'
                                        : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
