import {NextResponse, NextRequest} from 'next/server';

export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-url', request.url);

    if (request.nextUrl.pathname === '/error-page') {
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
