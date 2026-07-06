import React, { Suspense } from 'react';
import { cookies } from 'next/headers';
import Sidebar from '~/ui/common/layout/sidebar';
import SettingsSidebar from './components/SettingsSidebar';
import SettingsContent from './components/SettingsContent';
import SettingsMobileHeader from './components/SettingsMobileHeader';
import Loading from '~/ui/common/loading/Loading';



export default async function SettingsPage() {
    const cookieStore = await cookies();
    const userName = cookieStore.get('userName')?.value || 'User';

    return (
        <div className='flex min-h-screen bg-white xs:bg-[#FFFFF0]'>
            {/* Desktop Sidebar - hidden on mobile */}
            <div className='hidden lg:block xs:hidden'>
                <Sidebar username={userName} />
            </div>

            {/* Mobile Header */}
            <Suspense fallback={null}>
                <SettingsMobileHeader />
            </Suspense>

            {/* Main Content Area */}
            <div className='flex-1 p-4 md:p-6 lg:p-8 xs:px-4 xs:pt-24 xs:pb-6 overflow-x-hidden'>
                <div className='max-w-6xl mx-auto'>
                    <h1 className='typo-heading-lg-bold text-gray-900 mb-4 md:mb-6 xs:hidden'>Settings</h1>

                    {/* Settings Layout */}
                    <div className='flex flex-col md:flex-row md:gap-6 w-full'>
                        {/* Settings sidebar tabs - hidden on mobile */}
                        <div className='xs:hidden'>
                            <Suspense fallback={<Loading size="md" />}>
                                <SettingsSidebar />
                            </Suspense>
                        </div>

                        <div className='flex-1 w-full'>
                            <Suspense fallback={<Loading size="md" />}>
                                <SettingsContent />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}