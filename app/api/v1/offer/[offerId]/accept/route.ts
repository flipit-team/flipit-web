import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';
import { USE_MOCK } from '~/lib/mock-store';

export async function POST(req: NextRequest, { params }: { params: Promise<{ offerId: string }> }) {
    try {
        const { offerId } = await params;

        if (USE_MOCK) {
            return NextResponse.json({ id: Number(offerId), status: 'Accepted' });
        }

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

        const apiRes = await fetch(`${API_BASE_PATH}/offer/${offerId}/accept`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });
        const _ct = apiRes.headers.get('content-type') || '';

        if (!_ct.includes('application/json')) {

            console.error(`Backend non-JSON (${apiRes.status}): ${apiRes.url}`);

            return NextResponse.json({ apierror: { message: 'Server returned an unexpected response.' } }, { status: 502 });

        }

        let apiData: any;

        try { apiData = await apiRes.json(); } catch { return NextResponse.json({ apierror: { message: 'Invalid server response.' } }, { status: 502 }); }
        if (!apiRes.ok) return NextResponse.json({ apierror: apiData.apierror ?? { message: apiData.message || apiData.debugMessage || 'An error occurred' } }, { status: apiRes.status });
        return NextResponse.json(apiData);
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
