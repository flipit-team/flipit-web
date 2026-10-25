import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

// GET /api/v1/disputes/:id — Get dispute details
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json(
            { apierror: { message: 'Authentication required' } },
            { status: 401 }
        );
    }

    try {
        const apiRes = await fetch(`${API_BASE_PATH}/disputes/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        });

        if (!apiRes.ok) {
            let errorData;
            try { errorData = await apiRes.json(); } catch { errorData = { message: 'Failed to fetch dispute' }; }
            return NextResponse.json({ apierror: errorData.apierror ?? errorData }, { status: apiRes.status });
        }

        const apiData = await apiRes.json();
        return NextResponse.json(apiData);
    } catch (error) {
        console.error('Error fetching dispute:', error);
        return NextResponse.json({ apierror: { message: 'Internal server error' } }, { status: 500 });
    }
}
