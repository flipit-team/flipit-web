import '~/styles/globals.css';
import {Poppins} from 'next/font/google';
const poppins = Poppins({
    display: 'swap',
    variable: '--font-poppins',
    weight: ['300', '400', '500', '600', '700'],
    style: 'normal',
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
                className={`relative ${poppins.variable} antialiased flex flex-col min-h-screen no-scrollbar`}
                suppressHydrationWarning={true}
            >
                {children}
            </body>
        </html>
    );
}
