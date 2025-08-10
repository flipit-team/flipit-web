import React from 'react';
import Sidebar from '~/ui/common/layout/sidebar';
import PerformanceTiles from './components/PerformanceTiles';
import ChartContainer from './components/ChartContainer';

export default function PerformancePage() {
    return (
        <div className='flex min-h-screen bg-gray-50'>
            <Sidebar username="John" />
            
            {/* Main Content Area */}
            <div className='flex-1 p-8'>
                <div className='max-w-6xl mx-auto'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-6'>Performance</h1>
                    
                    {/* Performance Tiles */}
                    <PerformanceTiles />
                    
                    {/* Chart Section */}
                    <ChartContainer />
                </div>
            </div>
        </div>
    );
}