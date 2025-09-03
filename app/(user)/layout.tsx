import React, {Suspense} from 'react';
import ErrorBoundary from '~/error-boundary';
import {AppProvider} from '../contexts/AppContext';
import {ToastProvider} from '../contexts/ToastContext';
import { LikesProvider } from '../hooks/useLikes';
import Header from '~/ui/common/layout/header';
import Footer from '~/ui/common/layout/footer';
import BottomNavBar from '../ui/common/layout/bottom-nav-bar';
import Overlay from '../ui/common/modals/Overlay';
import { checkAuthServerSide } from '~/lib/server-api';

export default async function UserLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const authStatus = await checkAuthServerSide();
    
    const user = authStatus.isAuthenticated && authStatus.user ? {
        token: 'managed-by-cookies',
        userId: authStatus.user.id?.toString(),
        userName: authStatus.user.firstName || authStatus.user.username || authStatus.user.email || ''
    } : null;

    return (
        <AppProvider initialUser={user}>
            <ToastProvider>
                <LikesProvider>
                    <main className='flex flex-col flex-1 xs:pb-[100px]'>
                        <Suspense fallback={<p>Loading...</p>}>
                            <Header user={user} />
                        </Suspense>
                        <Suspense fallback={<p>Loading...</p>}>
                            <Overlay />
                        </Suspense>

                        <ErrorBoundary>{children}</ErrorBoundary>
                    </main>
                    <Footer />
                    <div className='xs:flex hidden relative'>
                        <Suspense fallback={<p>Loading...</p>}>
                            <BottomNavBar />
                        </Suspense>
                    </div>
                </LikesProvider>
            </ToastProvider>
        </AppProvider>
    );
}