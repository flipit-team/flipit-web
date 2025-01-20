import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: false,
    experimental: {
        webpackBuildWorker: true,
    },
    images: {
        unoptimized: false,
        remotePatterns: [
        
        ]
    },
 
};

export default nextConfig;
