import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: false,
    experimental: {
        webpackBuildWorker: true
    },
    images: {
        unoptimized: false,
        remotePatterns: [],
        domains: ['flipitimages1.s3.amazonaws.com', 'images.pexels.com']
    }
};

export default nextConfig;
