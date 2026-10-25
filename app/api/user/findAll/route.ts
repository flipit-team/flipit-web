import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {API_BASE_PATH} from '~/lib/config';

export async function GET(req: NextRequest) {
    const page = req.nextUrl.searchParams.get('page') ?? '0';
    const size = req.nextUrl.searchParams.get('size') ?? '15';

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json({error: 'Authentication required'}, {status: 401});
    }

    try {
        const apiRes = await fetch(`${API_BASE_PATH}/user/findAll?page=${page}&size=${size}`, {
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
                {apierror: apiData.apierror ?? {message: 'Failed to fetch users'}},
                {status: apiRes.status}
            );
        }

        return NextResponse.json(apiData);
    } catch (error) {
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}
