import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {API_BASE_PATH} from '~/lib/config';

export async function GET(req: NextRequest) {

    const page = req.nextUrl.searchParams.get('page') ?? '0';
    const size = req.nextUrl.searchParams.get('size') ?? '10';
    const query = req.nextUrl.searchParams.get('q') ?? '';
    const sort = req.nextUrl.searchParams.get('sort') ?? 'recent';
    const location = req.nextUrl.searchParams.get('location') ?? '';
    const category = req.nextUrl.searchParams.get('category') ?? '';

    // Build query parameters
    const params = new URLSearchParams({
        page,
        size,
        search: query,
        sort
    });

    // Add optional parameters if they exist
    if (location) params.append('location', location);
    if (category) params.append('category', category);

    const apiUrl = `${API_BASE_PATH}/items?${params.toString()}`;

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
