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

export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-url', request.url);

    const pathname = request.nextUrl.pathname;
    const token = request.cookies.get('token')?.value;
    const isAuthenticated = Boolean(token);

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => 
        pathname.startsWith(route)
    );

    // Check if the current path is a public auth route
    const isPublicRoute = publicRoutes.some(route => 
        pathname.startsWith(route)
    );


    // Redirect unauthenticated users from protected routes to login
    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL('/', request.url);
        loginUrl.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users from public auth routes to home
    if (isPublicRoute && isAuthenticated && pathname !== '/') {
        return NextResponse.redirect(new URL('/home', request.url));
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
