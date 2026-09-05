import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

        const formData = await req.formData();

        const apiRes = await fetch(`${API_BASE_PATH}/files/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                // Do NOT set Content-Type — let fetch set multipart boundary automatically
            },
            body: formData,
        });

        const apiData = await apiRes.json();
        if (!apiRes.ok) return NextResponse.json({ apierror: apiData.apierror ?? { message: 'Failed to upload file' } }, { status: apiRes.status });
        return NextResponse.json(apiData);
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
