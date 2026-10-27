import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';
import { USE_MOCK, createTransaction } from '~/lib/mock-store';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (USE_MOCK) {
            const tx = createTransaction(body);
            return NextResponse.json(tx);
        }

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

        const apiRes = await fetch(`${API_BASE_PATH}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(body),
            cache: 'no-store',
        });
        const _ct = apiRes.headers.get('content-type') || '';

        if (!_ct.includes('application/json')) {

            console.error(`Backend non-JSON (${apiRes.status}): ${apiRes.url}`);

            return NextResponse.json({ apierror: { message: 'Server returned an unexpected response.' } }, { status: 502 });

        }

        let apiData: any;

        try { apiData = await apiRes.json(); } catch { return NextResponse.json({ apierror: { message: 'Invalid server response.' } }, { status: 502 }); }
        if (!apiRes.ok) return NextResponse.json({ apierror: apiData.apierror ?? { message: apiData.message || apiData.debugMessage || 'Failed to create transaction' } }, { status: apiRes.status });
        return NextResponse.json(apiData);
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
