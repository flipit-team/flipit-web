import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {API_BASE_PATH} from '~/lib/config';

export async function GET(req: NextRequest) {

    const page = req.nextUrl.searchParams.get('page') ?? '0';
    const size = req.nextUrl.searchParams.get('size') ?? '10';
    const query = req.nextUrl.searchParams.get('q') ?? '';

    const apiUrl = `${API_BASE_PATH}/items?page=${page}&size=${size}&search=${encodeURIComponent(query)}`;

    // ✅ Get token from cookies
    const cookieStore = await cookies(); // ← must await!
    const token = cookieStore.get('token')?.value;

    try {
        const apiRes = await fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && {Authorization: `Bearer ${token}`}) // Include token only if it exists
            },
            cache: 'no-store'
        });

        const apiData = await apiRes.json();

        if (!apiRes.ok) {
            return NextResponse.json(
                {apierror: apiData.apierror ?? {message: 'Failed to fetch items'}},
                {status: apiRes.status}
            );
        }

        return NextResponse.json(apiData);
    } catch (error) {
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}
