import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: false,
    experimental: {
        webpackBuildWorker: true
    },
    images: {
        unoptimized: true,
        loader: 'custom',
        loaderFile: './app/lib/image-loader.ts',
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'flipitimages1.s3.amazonaws.com'
            },
            {
                protocol: 'https',
                hostname: 'flipitimages1.s3.us-east-1.amazonaws.com'
            },
            {
                protocol: 'https',
                hostname: 'images.pexels.com'
            }
        ]
    }
};

export default nextConfig;
