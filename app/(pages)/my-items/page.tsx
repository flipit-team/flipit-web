import React from 'react';
import Sidebar from '~/ui/common/layout/sidebar';
import GoBack from '~/ui/common/go-back';
import ItemsContainer from './components/ItemsContainer';
import {mockItems} from './data/mockItems';

export default function MyItemsPage() {
    return (
        <div className='flex min-h-screen bg-gray-50'>
            <Sidebar username="John" />
            
            {/* Main Content Area */}
            <div className='flex-1 p-8'>
                <div className='max-w-6xl mx-auto'>
                    <GoBack />

                    <div className='py-9 xs:pt-6 xs:py-0 xs:mb-4 typo-heading_ms'>My Items</div>

                    <ItemsContainer mockItems={mockItems} />
                </div>
            </div>
        </div>
    );
}
