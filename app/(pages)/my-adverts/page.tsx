import React from 'react';
import Sidebar from '~/ui/common/layout/sidebar';

export default function MyAdvertsPage() {
    return (
        <div className='flex min-h-screen bg-gray-50'>
            <Sidebar username="John" />
            
            {/* Main Content Area */}
            <div className='flex-1 p-8'>
                <div className='max-w-6xl mx-auto'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-6'>My Adverts</h1>
                    
                    {/* Placeholder content - to be implemented later */}
                    <div className='bg-white rounded-lg shadow p-6'>
                        <p className='text-gray-600'>My adverts content will be implemented here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}