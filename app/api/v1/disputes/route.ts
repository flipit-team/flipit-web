import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

// POST /api/v1/disputes — Open a dispute
export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json(
            { apierror: { message: 'Authentication required' } },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();

        const apiRes = await fetch(`${API_BASE_PATH}/disputes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body),
            cache: 'no-store'
        });

        if (!apiRes.ok) {
            let errorData;
            try { errorData = await apiRes.json(); } catch { errorData = { message: 'Failed to open dispute' }; }
            return NextResponse.json({ apierror: errorData.apierror ?? errorData }, { status: apiRes.status });
        }

        const apiData = await apiRes.json();
        return NextResponse.json(apiData, { status: 201 });
    } catch (error) {
        console.error('Error opening dispute:', error);
        return NextResponse.json({ apierror: { message: 'Internal server error' } }, { status: 500 });
    }
}
