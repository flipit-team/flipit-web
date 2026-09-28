import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

        const apiRes = await fetch(`${API_BASE_PATH}/shipping/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(body),
        });

        const responseText = await apiRes.text();
        let apiData;
        try { apiData = JSON.parse(responseText); } catch { apiData = { raw: responseText }; }

        if (!apiRes.ok) {
            console.error('[POST /shipping/create] Backend returned', apiRes.status, ':', JSON.stringify(apiData));
            console.error('[POST /shipping/create] Sent body:', JSON.stringify(body));
            return NextResponse.json({ apierror: apiData.apierror ?? apiData ?? { message: 'Shipping request failed' } }, { status: apiRes.status });
        }

        return NextResponse.json(apiData);
    } catch (error) {
        console.error('[POST /shipping/create] Exception:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
