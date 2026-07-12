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
        const apiData = await apiRes.json();
        if (!apiRes.ok) return NextResponse.json({ apierror: apiData.apierror ?? { message: 'Failed to create transaction' } }, { status: apiRes.status });
        return NextResponse.json(apiData);
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
