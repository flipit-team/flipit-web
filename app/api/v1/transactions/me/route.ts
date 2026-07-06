import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

// GET /api/v1/transactions/me - Get current user's transactions
export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const queryString = searchParams.toString();
        const url = `${API_BASE_PATH}/transactions/me${queryString ? `?${queryString}` : ''}`;

        const apiRes = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        const apiData = await apiRes.json();

        if (!apiRes.ok) {
            return NextResponse.json(
                { apierror: apiData.apierror ?? { message: 'Failed to fetch transactions' } },
                { status: apiRes.status }
            );
        }

        return NextResponse.json(apiData);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
