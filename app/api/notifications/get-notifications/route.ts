import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';

export async function GET(req: NextRequest) {
    console.log('✅ /api/items/get-items HIT');

    const page = req.nextUrl.searchParams.get('page') ?? '0';
    const size = req.nextUrl.searchParams.get('size') ?? '10';
    const read = req.nextUrl.searchParams.get('read') ?? '';

    const apiUrl = `https://flipit-api.onrender.com/api/v1/notifications?page=${page}&size=${size}&read=${read}`;

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
        console.log(apiRes, 999);

        const apiData = await apiRes.json();

        if (!apiRes.ok) {
            return NextResponse.json(
                {apierror: apiData.apierror ?? {message: 'Failed to fetch items'}},
                {status: apiRes.status}
            );
        }

        return NextResponse.json(apiData);
    } catch (error) {
        console.error('❌ Error fetching items:', error);
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}
