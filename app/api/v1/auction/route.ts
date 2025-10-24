import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

export async function POST(req: NextRequest) {

    try {
        const body = await req.json();

        const apiUrl = `${API_BASE_PATH}/auction`;

        // Get token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;


        const apiRes = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && {Authorization: `Bearer ${token}`})
            },
            body: JSON.stringify(body),
            cache: 'no-store'
        });


        const apiData = await apiRes.json();

        if (!apiRes.ok) {
            return NextResponse.json(
                {apierror: apiData.apierror ?? {message: 'Failed to create auction'}},
                {status: apiRes.status}
            );
        }

        return NextResponse.json(apiData);
    } catch (error) {
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}

export async function GET(req: NextRequest) {

    const searchParams = req.nextUrl.searchParams;

    // Forward all query parameters to backend
    const queryString = searchParams.toString();
    const apiUrl = `${API_BASE_PATH}/auction${queryString ? `?${queryString}` : ''}`;

    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    try {
        const apiRes = await fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && {Authorization: `Bearer ${token}`})
            },
            cache: 'no-store'
        });


        const apiData = await apiRes.json();

        if (!apiRes.ok) {
            return NextResponse.json(
                {apierror: apiData.apierror ?? {message: 'Failed to fetch auctions'}},
                {status: apiRes.status}
            );
        }

        return NextResponse.json(apiData);
    } catch (error) {
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}