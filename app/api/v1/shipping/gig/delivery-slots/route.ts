import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

        const { searchParams } = req.nextUrl;
        const state = searchParams.get('state') ?? '';
        const lga = searchParams.get('lga') ?? '';
        const date = searchParams.get('date') ?? '';

        const apiRes = await fetch(
            `${API_BASE_PATH}/shipping/gig/delivery-slots?state=${encodeURIComponent(state)}&lga=${encodeURIComponent(lga)}&date=${encodeURIComponent(date)}`,
            {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                cache: 'no-store',
            }
        );

        const apiData = await apiRes.json();
        if (!apiRes.ok) return NextResponse.json({ apierror: apiData.apierror ?? { message: 'Failed to get delivery slots' } }, { status: apiRes.status });
        return NextResponse.json(apiData);
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
