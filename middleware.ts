// middleware.ts
import {NextRequest, NextResponse} from 'next/server';

const PUBLIC_PATHS = [
    '/', // exact‐match only
    '/home',
    '/login', // exact‐match only
    '/error-page', // exact‐match only
    '/api/auth/login', // your login endpoint
    '/api/auth/me' // your “whoami” endpoint
];

export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;

    // Grab the token (works because we’re using NextRequest)
    const token = request.cookies.get('token')?.value;

    // Determine if this path is public:
    const isExactPublic = PUBLIC_PATHS.includes(pathname);
    const isSubpathPublic = ['/dashboard-public' /* …other public subfolders… */].some((p) =>
        pathname.startsWith(p + '/')
    );
    const isPublic = isExactPublic || isSubpathPublic;

    if (!isPublic && !token) {
        // No token + non‑public route → redirect to login
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // If you really want to force an error status on /error-page…
    if (pathname === '/error-page') {
        return new NextResponse('Something went wrong', {status: 500});
    }

    // Otherwise continue
    return NextResponse.next();
}
