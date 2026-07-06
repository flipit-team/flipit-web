'use client';
import React, {Suspense, useMemo} from 'react';
import {usePathname} from 'next/navigation';
import BottomNavBar from './bottom-nav-bar';
import Loading from '~/ui/common/loading/Loading';

const ConditionalBottomNav: React.FC = () => {
    const pathname: string = usePathname();

    // Hide bottom nav on login, item detail, and manage pages
    const shouldHideBottomNav: boolean = useMemo(() => {
        if (pathname === '/login') return true;
        // Item detail pages (viewing someone else's item: /123, /456 etc)
        if (/^\/\d+$/.test(pathname)) return true;
        // Manage item/auction pages (viewing your own item)
        if (pathname.startsWith('/manage-item/') || pathname.startsWith('/manage-auction/')) return true;
        // Live auction detail
        if (/^\/live-auction\/.+$/.test(pathname)) return true;
        return false;
    }, [pathname]);

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