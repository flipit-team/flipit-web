import React, { Suspense } from 'react';
import Sidebar from '~/ui/common/layout/sidebar';
import SettingsSidebar from './components/SettingsSidebar';
import SettingsContent from './components/SettingsContent';
import Loading from '~/ui/common/loading/Loading';



export default function SettingsPage() {
    return (
        <div className='flex min-h-screen bg-gray-50'>
            {/* Desktop Sidebar - hidden on mobile/tablet */}
            <div className='hidden lg:block'>
                <Sidebar username="John" />
            </div>
            
            {/* Main Content Area */}
            <div className='flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden'>
                <div className='max-w-6xl mx-auto'>
                    <h1 className='typo-heading-lg-bold md:typo-display-lg text-gray-900 mb-4 md:mb-6'>Settings</h1>
                    
                    {/* Settings Layout */}
                    <div className='flex flex-col md:flex-row md:gap-6 w-full'>
                        <Suspense fallback={<Loading size="md" text="Loading..." />}>
                            <SettingsSidebar />
                        </Suspense>
                        
                        <div className='flex-1 w-full'>
                            <Suspense fallback={<Loading size="md" text="Loading..." />}>
                                <SettingsContent />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}