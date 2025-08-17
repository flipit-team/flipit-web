import {NextResponse} from 'next/server';
import {API_BASE_PATH} from '~/lib/config';

export async function POST(req: Request) {
    const body = await req.json();

    const apiRes = await fetch(`${API_BASE_PATH}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    });
    const apiData = await apiRes.json();

    console.log(apiData);

    if (!apiRes.ok) {
        return NextResponse.json({apierror: apiData.apierror}, {status: apiRes.status});
    }

    const res = NextResponse.json({message: apiData}, {status: 200});
    
    // Handle different response formats: either token/user or jwt/user
    const token = apiData.token || apiData.jwt;
    const user = apiData.user;
    
    if (!token) {
        console.error('No token found in API response:', apiData);
        return NextResponse.json({apierror: {message: 'No token received from server'}}, {status: 500});
    }
    
    if (!user || !user.id) {
        console.error('No user or user.id found in API response:', apiData);
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
