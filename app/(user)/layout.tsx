import React, {Suspense} from 'react';
import ErrorBoundary from '~/error-boundary';
import {AppProvider} from '../contexts/AppContext';
import {ToastProvider} from '../contexts/ToastContext';
import { LikesProvider } from '../hooks/useLikes';
import Header from '~/ui/common/layout/header';
import Footer from '~/ui/common/layout/footer';
import Overlay from '../ui/common/modals/Overlay';
import { checkAuthServerSide } from '~/lib/server-api';
import ConditionalBottomNav from '../ui/common/layout/ConditionalBottomNav';
import Loading from '~/ui/common/loading/Loading';

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
                        <Suspense fallback={<Loading size="sm" text="Loading header..." />}>
                            <Header user={user} />
                        </Suspense>
                        <Suspense fallback={<Loading size="xs" />}>
                            <Overlay />
                        </Suspense>

                        <ErrorBoundary>{children}</ErrorBoundary>
                    </main>
                    <Footer />
                    <ConditionalBottomNav />
                </LikesProvider>
            </ToastProvider>
        </AppProvider>
    );
}