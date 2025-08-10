import React, { Suspense } from 'react';
import Sidebar from '~/ui/common/layout/sidebar';
import SettingsSidebar from './components/SettingsSidebar';
import VerificationContent from './components/VerificationContent';

// Loading component for Suspense
function LoadingContent() {
    return (
        <div className='flex-1 bg-white rounded-lg shadow p-6'>
            <div className='animate-pulse space-y-4'>
                <div className='h-8 bg-gray-200 rounded w-1/3'></div>
                <div className='h-px bg-gray-200 w-full'></div>
                <div className='h-4 bg-gray-200 rounded w-1/4'></div>
                <div className='h-6 bg-gray-200 rounded w-1/2'></div>
            </div>
        </div>
    );
}

// Content component that uses search params
function SettingsContent() {
    // For now, we'll default to verification content
    // Later you can add logic to show different content based on search params
    
    return (
        <div className='flex-1 bg-white rounded-lg shadow p-6'>
            <div className='max-w-4xl'>
                <h2 className='text-xl font-medium text-gray-900 mb-4'>Verification</h2>
                <div className='h-px bg-border_gray mb-8 w-full'></div>
                
                <VerificationContent />
            </div>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <div className='flex min-h-screen bg-gray-50'>
            <Sidebar username="John" />
            
            {/* Main Content Area */}
            <div className='flex-1 p-8'>
                <div className='max-w-6xl mx-auto'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-6'>Settings</h1>
                    
                    {/* Settings Layout */}
                    <div className='flex gap-6'>
                        <SettingsSidebar />
                        
                        <Suspense fallback={<LoadingContent />}>
                            <SettingsContent />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}