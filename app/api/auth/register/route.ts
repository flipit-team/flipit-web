import {NextResponse} from 'next/server';
import {API_BASE_PATH} from '~/lib/config';

export async function POST(req: Request) {
    const body = await req.json();
    
    // Map frontend fields to backend fields
    const backendBody = {
        username: body.username,
        email: body.email,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName,
        phoneNumber: body.phone, // Map phone to phoneNumber
        dateOfBirth: body.dateOfBirth
    };

    console.log('Signup request:', { ...backendBody, password: '[REDACTED]' });

    const response = await fetch(`${API_BASE_PATH}/user/signup`, {
        method: 'POST',
        body: JSON.stringify(backendBody),
        headers: {'Content-Type': 'application/json'}
    });

    const data = await response.json();

    if (!response.ok) {
        return NextResponse.json({apierror: data.apierror}, {status: response.status});
    }

    const res = NextResponse.json({message: data}, {status: 200});
    
    // Handle different response formats: either token/user or jwt/user
    const token = data.token || data.jwt;
    const user = data.user;
    
    if (!token) {
        console.error('No token found in API response:', data);
        return NextResponse.json({apierror: {message: 'No token received from server'}}, {status: 500});
    }
    
    if (!user || !user.id) {
        console.error('No user or user.id found in API response:', data);
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
    
    res.cookies.set('userName', user.firstName || user.username || '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return res;
}
