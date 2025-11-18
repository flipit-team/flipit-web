import {NextResponse, NextRequest} from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
    '/post-an-item',
    '/my-items',
    '/current-bids',
    '/saved-items',
    '/settings',
    '/notifications',
    '/messages',
    '/profile'
];

// Define public routes that should redirect authenticated users
const publicRoutes = [
    '/auth',
    '/login',
    '/register',
    '/forgot-password'
];

// Use production backend for all environments
const API_BASE_URL = 'https://api.flipit.ng';

async function validateToken(token: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/user/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });
        // Only return false on 401 (invalid token), not on 404 or 500
        if (response.status === 401) {
            return false;
        }
        // For other status codes (including 404 if endpoint doesn't exist), assume token is valid
        return response.ok || response.status !== 401;
    } catch {
        // On network errors, assume token is valid (don't log users out on network issues)
        return true;
    }
}

export async function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-url', request.url);

    const pathname = request.nextUrl.pathname;
    const token = request.cookies.get('token')?.value;

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    // Check if the current path is a public auth route
    const isPublicRoute = publicRoutes.some(route =>
        pathname.startsWith(route)
    );

    // Validate token if it exists
    let isAuthenticated = false;
    if (token) {
        isAuthenticated = await validateToken(token);

        // If token is invalid, clear the cookies
        if (!isAuthenticated) {
            const response = NextResponse.next({
                request: {
                    headers: requestHeaders
                }
            });
            response.cookies.delete('token');
            response.cookies.delete('userId');
            response.cookies.delete('userName');

            // If trying to access protected route with invalid token, redirect to login
            if (isProtectedRoute) {
                const loginUrl = new URL('/login', request.url);
                loginUrl.searchParams.set('redirectTo', pathname);
                return NextResponse.redirect(loginUrl);
            }

            return response;
        }
    }

    // Redirect unauthenticated users from protected routes to login
    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users from public auth routes to home
    if (isPublicRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Handle error-500 page
    if (pathname === '/error-500') {
        return NextResponse.next({
            request: {
                headers: requestHeaders
            },
            status: 500
        });
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders
        }
    });
}

// Configure which paths should trigger the middleware
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, icons, etc)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
    ],
}
