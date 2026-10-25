import {NextResponse} from 'next/server';
import {API_BASE_PATH} from '~/lib/config';

export async function POST(req: Request) {
    const body = await req.json();
    
    // Map frontend fields to backend fields
    const backendBody = {
        email: body.email,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName,
        phoneNumber: body.phoneNumber || body.phone, // Handle both phoneNumber and phone
    };


    let response: Response;
    try {
        response = await fetch(`${API_BASE_PATH}/user/signup`, {
            method: 'POST',
            body: JSON.stringify(backendBody),
            headers: {'Content-Type': 'application/json'}
        });
    } catch (networkErr) {
        console.error('Register network error:', networkErr);
        return NextResponse.json(
            {apierror: {message: 'Unable to reach the server. Please try again later.'}},
            {status: 503}
        );
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        console.error(`Register: backend returned non-JSON (${response.status}): content-type=${contentType}`);
        return NextResponse.json(
            {apierror: {message: 'Server returned an unexpected response. Please try again later.'}},
            {status: 502}
        );
    }

    let data: any;
    try {
        data = await response.json();
    } catch {
        return NextResponse.json(
            {apierror: {message: 'Server returned an invalid response. Please try again later.'}},
            {status: 502}
        );
    }

    if (!response.ok) {
        return NextResponse.json(
            {apierror: data.apierror ?? {message: data.message || 'Registration failed. Please check your details and try again.'}},
            {status: response.status}
        );
    }

    const res = NextResponse.json({message: data}, {status: 200});
    
    // Handle different response formats: either token/user or jwt/user
    const token = data.token || data.jwt;
    const user = data.user;
    
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
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    res.cookies.set('userId', user.id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    
    res.cookies.set('userName', user.firstName || '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return res;
}
