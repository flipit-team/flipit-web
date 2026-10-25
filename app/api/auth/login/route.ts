import {NextResponse} from 'next/server';
import {API_BASE_PATH} from '~/lib/config';

export async function POST(req: Request) {
    const body = await req.json();

    let apiRes: Response;
    try {
        apiRes = await fetch(`${API_BASE_PATH}/auth/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        });
    } catch (networkErr) {
        console.error('Login network error:', networkErr);
        return NextResponse.json(
            {apierror: {message: 'Unable to reach the server. Please try again later.'}},
            {status: 503}
        );
    }

    // Guard against non-JSON responses (e.g. HTML error pages from proxy/gateway)
    const contentType = apiRes.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        console.error(`Login: backend returned non-JSON (${apiRes.status}): content-type=${contentType}`);
        return NextResponse.json(
            {apierror: {message: 'Server returned an unexpected response. Please try again later.'}},
            {status: 502}
        );
    }

    let apiData: any;
    try {
        apiData = await apiRes.json();
    } catch {
        console.error('Login: failed to parse JSON response');
        return NextResponse.json(
            {apierror: {message: 'Server returned an invalid response. Please try again later.'}},
            {status: 502}
        );
    }

    if (!apiRes.ok) {
        return NextResponse.json(
            {apierror: apiData.apierror ?? {message: apiData.message || 'The email or password you entered is incorrect.'}},
            {status: apiRes.status}
        );
    }

    const res = NextResponse.json({message: apiData}, {status: 200});
    
    // Handle different response formats: either token/user or jwt/user
    const token = apiData.token || apiData.jwt;
    const user = apiData.user;
    
    if (!token) {
        return NextResponse.json({apierror: {message: 'No token received from server'}}, {status: 500});
    }
    
    if (!user || !user.id) {
        return NextResponse.json({apierror: {message: 'No user data received from server'}}, {status: 500});
    }
    
    res.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'lax' // Ensure cookie is sent with same-site requests
    });

    res.cookies.set('userId', user.id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'lax'
    });
    
    res.cookies.set('userName', user.firstName || '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'lax'
    });
    
    return res;
}
