import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';
import { USE_MOCK, getTransaction } from '~/lib/mock-store';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        if (USE_MOCK) {
            const tx = getTransaction(Number(id));
            if (!tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
            return NextResponse.json(tx);
        }

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

        const apiRes = await fetch(`${API_BASE_PATH}/transactions/${id}`, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });
        const apiData = await apiRes.json();
        if (!apiRes.ok) return NextResponse.json({ apierror: apiData.apierror ?? { message: 'Failed to fetch transaction' } }, { status: apiRes.status });
        return NextResponse.json(apiData);
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
