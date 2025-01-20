import '~/styles/globals.css';
import {Poppins, Inter} from 'next/font/google';
import Header from '~/ui/common/layout/header';
import Footer from '~/ui/common/layout/footer';
import React from 'react';
import ErrorBoundary from '~/error-boundary';

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
    return (
        <html lang='en'>
            <head>
                {/* <link rel='icon' href='/favicon.ico' sizes='any' />
                <link rel='apple-touch-icon' href='/apple-touch-icon.png' sizes='180x180' type='image/png' />
                <link rel='icon' href='/favicon-32x32.png' sizes='32x32' type='image/png' />
                <link rel='icon' href='/favicon-16x16.png' sizes='16x16' type='image/png' />
                <link rel='manifest' href='/site.webmanifest' /> */}
            </head>
            <body className={`${inter.variable} ${poppins.variable} antialiased flex flex-col min-h-[100vh]`}>
                <Header />

                <main className='flex flex-col flex-1'>
                    <ErrorBoundary>{children}</ErrorBoundary>
                </main>
                <Footer />
            </body>
        </html>
    );
}
