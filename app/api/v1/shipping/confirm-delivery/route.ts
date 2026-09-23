import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

        const waybill = body.waybill || body.waybillNumber || '';
        const apiRes = await fetch(`${API_BASE_PATH}/shipping/confirm-delivery?waybill=${encodeURIComponent(waybill)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });

        const responseText = await apiRes.text();
        if (!apiRes.ok) {
            let apiData;
            try { apiData = JSON.parse(responseText); } catch { apiData = { message: responseText }; }
            return NextResponse.json({ apierror: apiData.apierror ?? { message: 'Failed to confirm delivery' } }, { status: apiRes.status });
        }
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
