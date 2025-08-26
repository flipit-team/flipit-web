import '~/styles/globals.css';
import {Poppins, Inter} from 'next/font/google';
import Header from '~/ui/common/layout/header';
import Footer from '~/ui/common/layout/footer';
import React, {Suspense} from 'react';
import ErrorBoundary from '~/error-boundary';
import {AppProvider} from './contexts/AppContext';
import {ToastProvider} from './contexts/ToastContext';
import BottomNavBar from './ui/common/layout/bottom-nav-bar';
import Overlay from './ui/common/modals/Overlay';
import { checkAuthServerSide } from '~/lib/server-api';
const poppins = Poppins({
    display: 'swap',
    variable: '--font-poppins',
    weight: ['700', '600', '400'],
    style: 'normal',
    subsets: ['latin']
});

const inter = Inter({
    display: 'swap',
    variable: '--font-inter',
    weight: ['700', '600', '400'],
    style: ['normal', 'italic'],
    subsets: ['latin']
});

export default async function RootLayout({
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
        <html lang='en'>
            <head>
                {/* <link rel='icon' href='/favicon.ico' sizes='any' />
                <link rel='apple-touch-icon' href='/apple-touch-icon.png' sizes='180x180' type='image/png' />
                <link rel='icon' href='/favicon-32x32.png' sizes='32x32' type='image/png' />
                <link rel='icon' href='/favicon-16x16.png' sizes='16x16' type='image/png' />
                <link rel='manifest' href='/site.webmanifest' /> */}
            </head>
            <body
                className={`relative ${inter.variable} ${poppins.variable} antialiased flex flex-col min-h-[100vh]`}
                suppressHydrationWarning={true}
            >
                <AppProvider initialUser={user}>
                    <ToastProvider>
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
                    </ToastProvider>
                </AppProvider>
            </body>
        </html>
    );
}
