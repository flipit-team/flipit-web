import '~/styles/globals.css';
import {Poppins, Inter} from 'next/font/google';
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
                <link rel='icon' href='/logos/favicon-cropped.svg' type='image/svg+xml' />
            </head>
            <body
                className={`relative ${inter.variable} ${poppins.variable} antialiased flex flex-col min-h-[100vh] no-scrollbar`}
                suppressHydrationWarning={true}
            >
                {children}
            </body>
        </html>
    );
}
