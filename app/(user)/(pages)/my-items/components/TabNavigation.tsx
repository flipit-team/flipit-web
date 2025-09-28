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
            <div className='overflow-x-auto scrollbar-hide'>
                <div className='flex space-x-8 border-b border-border_gray relative min-w-max'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`pb-4 px-1 relative transition-colors duration-200 whitespace-nowrap ${
                                activeTab === tab.id ? 'text-primary font-medium' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary' />}
                        </button>
                    ))}
                    <div className='absolute bottom-0 left-0 right-0 h-px bg-border_gray -z-10' />
                </div>
            </div>
        </div>
    );
}
