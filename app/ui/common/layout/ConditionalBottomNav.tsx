'use client';
import React, {Suspense, useMemo} from 'react';
import {usePathname} from 'next/navigation';
import BottomNavBar from './bottom-nav-bar';
import Loading from '~/ui/common/loading/Loading';

const ConditionalBottomNav: React.FC = () => {
    const pathname: string = usePathname();

    // Hide bottom nav on login/signup page (root path)
    const shouldHideBottomNav: boolean = useMemo(() => pathname === '/', [pathname]);

    if (shouldHideBottomNav) {
        return null;
    }

    return (
        <div className='xs:flex hidden relative'>
            <Suspense fallback={<Loading size="xs" variant="dots" center={false} className="fixed bottom-4 left-1/2 transform -translate-x-1/2" />}>
                <BottomNavBar />
            </Suspense>
        </div>
    );
};

export default ConditionalBottomNav;