import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

export async function GET() {

    const apiUrl = `${API_BASE_PATH}/chats`;

    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json(
            {apierror: {message: 'Authentication required'}},
            {status: 401}
        );
    }

    try {
        const apiRes = await fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store'
        });

        const _ct = apiRes.headers.get('content-type') || '';


        if (!_ct.includes('application/json')) {


            console.error(`Backend non-JSON (${apiRes.status}): ${apiRes.url}`);


            return NextResponse.json({ apierror: { message: 'Server returned an unexpected response.' } }, { status: 502 });


        }


        let apiData: any;


        try { apiData = await apiRes.json(); } catch { return NextResponse.json({ apierror: { message: 'Invalid server response.' } }, { status: 502 }); }

        if (!apiRes.ok) {
            return NextResponse.json(
                {apierror: apiData.apierror ?? {message: 'Failed to fetch chats'}},
                {status: apiRes.status}
            );
        }

        return NextResponse.json(apiData);
    } catch (error) {
        return NextResponse.json(
            {apierror: {message: 'Internal server error'}},
            {status: 500}
        );
    }
}

export async function POST(request: Request) {

    const apiUrl = `${API_BASE_PATH}/chats`;

    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json(
            {apierror: {message: 'Authentication required'}},
            {status: 401}
        );
    }

    try {
        const body = await request.json();

        const apiRes = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        const _ct = apiRes.headers.get('content-type') || '';


        if (!_ct.includes('application/json')) {


            console.error(`Backend non-JSON (${apiRes.status}): ${apiRes.url}`);


            return NextResponse.json({ apierror: { message: 'Server returned an unexpected response.' } }, { status: 502 });


        }


        let apiData: any;


        try { apiData = await apiRes.json(); } catch { return NextResponse.json({ apierror: { message: 'Invalid server response.' } }, { status: 502 }); }

        if (!apiRes.ok) {
            return NextResponse.json(
                {apierror: apiData.apierror ?? {message: 'Failed to create chat'}},
                {status: apiRes.status}
            );
        }

        return NextResponse.json(apiData);
    } catch (error) {
        return NextResponse.json(
            {apierror: {message: 'Internal server error'}},
            {status: 500}
        );
    }
}