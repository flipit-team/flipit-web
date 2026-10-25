import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json({ apierror: { message: 'Authentication required' } }, { status: 401 });
    }

    try {
        const apiRes = await fetch(`${API_BASE_PATH}/admin/customers/${userId}/whitelist`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
        });

        if (!apiRes.ok) {
            let errorData;
            try { errorData = await apiRes.json(); } catch { errorData = { message: 'Failed to whitelist customer' }; }
            return NextResponse.json({ apierror: errorData.apierror ?? errorData }, { status: apiRes.status });
        }

        return NextResponse.json({ message: 'Customer whitelisted successfully' });
    } catch (error) {
        console.error('Error whitelisting customer:', error);
        return NextResponse.json({ apierror: { message: 'Internal server error' } }, { status: 500 });
    }
}
