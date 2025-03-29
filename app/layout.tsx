import '~/styles/globals.css';
import {Poppins, Inter} from 'next/font/google';
import Header from '~/ui/common/layout/header';
import Footer from '~/ui/common/layout/footer';
import React, {Suspense} from 'react';
import ErrorBoundary from '~/error-boundary';
import {AppProvider} from './contexts/AppContext';
import BottomNavBar from './ui/common/layout/bottom-nav-bar';

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
    const menu = ['vehicles', 'apparel', 'Electronics', 'Entertainment', 'Home Appliances', 'Phones', 'Fashion'];

    return (
        <html lang='en'>
            <head>
                {/* <link rel='icon' href='/favicon.ico' sizes='any' />
                <link rel='apple-touch-icon' href='/apple-touch-icon.png' sizes='180x180' type='image/png' />
                <link rel='icon' href='/favicon-32x32.png' sizes='32x32' type='image/png' />
                <link rel='icon' href='/favicon-16x16.png' sizes='16x16' type='image/png' />
                <link rel='manifest' href='/site.webmanifest' /> */}
            </head>
            <AppProvider>
                <body
                    className={`relative ${inter.variable} ${poppins.variable} antialiased flex flex-col min-h-[100vh]`}
                >
                    <main className='flex flex-col flex-1 xs:pb-[100px]'>
                        <Header menu={menu} />

                        <ErrorBoundary>{children}</ErrorBoundary>
                    </main>
                    <Footer />
                    <div className='xs:flex hidden relative'>
                        <BottomNavBar />
                    </div>
                </body>
            </AppProvider>
        </html>
    );
}
