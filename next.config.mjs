import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: false,
    experimental: {
        webpackBuildWorker: true
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'flipitimages1.s3.amazonaws.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'flipitimages1.s3.us-east-1.amazonaws.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            }
        ]
    }
};

export default nextConfig;
