import React, { Suspense } from 'react';
import Sidebar from '~/ui/common/layout/sidebar';
import SettingsSidebar from './components/SettingsSidebar';
import SettingsContent from './components/SettingsContent';

// Loading component for Suspense
function LoadingContent() {
    return (
        <div className='flex-1 bg-white rounded-lg shadow p-4 md:p-6'>
            <div className='animate-pulse space-y-4'>
                <div className='h-6 md:h-8 bg-gray-200 rounded w-1/3'></div>
                <div className='h-px bg-gray-200 w-full'></div>
                <div className='h-4 bg-gray-200 rounded w-1/4'></div>
                <div className='h-6 bg-gray-200 rounded w-1/2'></div>
            </div>
        </div>
    );
}


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
                    <h1 className='text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6'>Settings</h1>
                    
                    {/* Settings Layout */}
                    <div className='flex flex-col md:flex-row md:gap-6 w-full'>
                        <SettingsSidebar />
                        
                        <div className='flex-1 w-full'>
                            <Suspense fallback={<LoadingContent />}>
                                <SettingsContent />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}