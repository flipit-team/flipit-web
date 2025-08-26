import {NextResponse} from 'next/server';

export async function POST() {
    // ✅ Create a response object
    const res = NextResponse.json({message: 'Logged out'});

    // ✅ Clear the cookie by setting it with maxAge: 0
    res.cookies.set('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0 // this deletes the cookie
    });
    res.cookies.set('userId', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0 // this deletes the cookie
    });
    res.cookies.set('userName', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0 // this deletes the cookie
    });

    return res;
}
