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
        remotePatterns: []
    },
    async rewrites() {
        return [
            {
                source: '/api/signup',
                destination: 'https://flipit-api.onrender.com/api/v1/user/signup'
            },
            {
                source: '/api/login',
                destination: 'https://flipit-api.onrender.com/api/v1/auth/login'
            },
            {
                source: '/api/google',
                destination: 'https://flipit-api.onrender.com/api/v1/auth/login/google'
            }
        ];
    }
};

export default nextConfig;
