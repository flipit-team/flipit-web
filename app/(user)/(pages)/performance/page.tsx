import React from 'react';
import { cookies } from 'next/headers';
import Sidebar from '~/ui/common/layout/sidebar';
import PerformanceTiles from './components/PerformanceTiles';
import ChartContainer from './components/ChartContainer';
import MobileHeader from './components/MobileHeader';

export default async function PerformancePage() {
    const cookieStore = await cookies();
    const userName = cookieStore.get('userName')?.value || 'User';

    return (
        <div className='flex h-screen sm:min-h-screen bg-white xs:bg-[#FFFFF0]'>
            {/* Desktop Sidebar - hidden on mobile/tablet */}
            <div className='hidden lg:block'>
                <Sidebar username={userName} />
            </div>

            {/* Main Content Area */}
            <div className='flex-1 p-4 md:p-6 lg:p-8 xs:p-0 xs:px-4 xs:pt-4 xs:pb-24 overflow-x-hidden'>
                <div className='max-w-6xl mx-auto'>
                    {/* Mobile header */}
                    <MobileHeader />

                    <h1 className='typo-heading-lg-bold text-gray-900 mb-4 md:mb-6 xs:hidden'>Performance</h1>

                    {/* Performance Tiles */}
                    <PerformanceTiles />

                    {/* Chart Section */}
                    <ChartContainer />
                </div>
            </div>
        </div>
    );
}