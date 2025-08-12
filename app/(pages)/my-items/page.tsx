import React from 'react';
import Sidebar from '~/ui/common/layout/sidebar';
import GoBack from '~/ui/common/go-back';
import ItemsContainer from './components/ItemsContainer';
import {mockItems} from './data/mockItems';

export default function MyItemsPage() {
    return (
        <div className='flex min-h-screen bg-gray-50'>
            {/* Desktop Sidebar - hidden on mobile/tablet */}
            <div className='hidden lg:block'>
                <Sidebar username="John" />
            </div>
            
            {/* Main Content Area */}
            <div className='flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden'>
                <div className='max-w-6xl mx-auto'>
                    <GoBack />

                    <div className='py-6 md:py-9 xs:pt-6 xs:py-0 xs:mb-4 text-2xl md:text-3xl font-bold text-gray-900'>My Items</div>

                    <ItemsContainer mockItems={mockItems} />
                </div>
            </div>
        </div>
    );
}
