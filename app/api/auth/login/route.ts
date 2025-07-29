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
    res.cookies.set('token', apiData.jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    // Set userId cookie (assuming `userId` is available in `apiData`)
    res.cookies.set('userId', apiData.user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    res.cookies.set('userName', apiData.user.firstName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    return res;
}
