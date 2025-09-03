import React from 'react';
import Sidebar from '~/ui/common/layout/sidebar';
import PerformanceTiles from './components/PerformanceTiles';
import ChartContainer from './components/ChartContainer';

export default function PerformancePage() {
    return (
        <div className='flex min-h-screen bg-gray-50'>
            {/* Desktop Sidebar - hidden on mobile/tablet */}
            <div className='hidden lg:block'>
                <Sidebar username="John" />
            </div>
            
            {/* Main Content Area */}
            <div className='flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden'>
                <div className='max-w-6xl mx-auto'>
                    <h1 className='typo-heading-lg-bold md:typo-display-lg text-gray-900 mb-4 md:mb-6'>Performance</h1>
                    
                    {/* Performance Tiles */}
                    <PerformanceTiles />
                    
                    {/* Chart Section */}
                    <ChartContainer />
                </div>
            </div>
        </div>
    );
}