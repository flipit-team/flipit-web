import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

// GET /api/v1/transactions/:id - Get transaction by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        const apiRes = await fetch(`${API_BASE_PATH}/transactions/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        const apiData = await apiRes.json();

        if (!apiRes.ok) {
            return NextResponse.json(
                { apierror: apiData.apierror ?? { message: 'Failed to fetch transaction' } },
                { status: apiRes.status }
            );
        }

        return NextResponse.json(apiData);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
