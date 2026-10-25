import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_PATH } from '~/lib/config';

// POST /api/v1/waitlist — Join waitlist (no auth required)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const apiRes = await fetch(`${API_BASE_PATH}/waitlist`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            cache: 'no-store'
        });

        if (!apiRes.ok) {
            let errorData;
            try { errorData = await apiRes.json(); } catch { errorData = { message: 'Failed to join waitlist' }; }
            return NextResponse.json({ apierror: errorData.apierror ?? errorData }, { status: apiRes.status });
        }

        const apiData = await apiRes.json();
        return NextResponse.json(apiData, { status: 201 });
    } catch (error) {
        console.error('Error joining waitlist:', error);
        return NextResponse.json({ apierror: { message: 'Internal server error' } }, { status: 500 });
    }
}
