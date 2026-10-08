import {redirect} from 'next/navigation';
import React, {Suspense} from 'react';
import Profile from '~/ui/wrappers/Profile';
import MobileProfileMenu from './MobileProfileMenu';
import LogoLoader from '~/ui/common/logo-loader/LogoLoader';

const page = () => {
    try {
        return (
            <Suspense fallback={<LogoLoader />}>
                {/* Desktop: existing form-based profile */}
                <div className='xs:hidden'>
                    <Profile />
                </div>
                {/* Mobile: menu-driven profile hub */}
                <div className='hidden xs:block'>
                    <MobileProfileMenu />
                </div>
            </Suspense>
        );
    } catch {
        redirect('/error-page');
    }
};

export default page;
