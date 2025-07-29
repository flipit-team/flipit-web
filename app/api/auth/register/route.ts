import {NextResponse} from 'next/server';
import {API_BASE_PATH} from '~/lib/config';

export async function POST(req: Request) {
    const body = await req.json();

    // replace with your real auth logic
    const response = await fetch(`${API_BASE_PATH}/user/signup`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    });

    const data = await response.json();

    if (!response.ok) {
        return NextResponse.json({apierror: data.apierror}, {status: response.status});
    }

    const res = NextResponse.json({message: data}, {status: 200});
    res.cookies.set('token', data.jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    // Set userId cookie (assuming `userId` is available in `apiData`)
    res.cookies.set('userId', data.user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    res.cookies.set('userName', data.user.firstName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return res;
}
