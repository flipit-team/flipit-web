import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

export async function PUT(
    req: NextRequest,
    {params}: {params: Promise<{id: string}>}
) {
    const {id} = await params;

    const apiUrl = `${API_BASE_PATH}/notifications/${id}/markAsRead`;

    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    try {
        const apiRes = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token && {Authorization: `Bearer ${token}`})
            },
            cache: 'no-store'
        });

        const apiData = await apiRes.json();

        if (!apiRes.ok) {
            return NextResponse.json(
                {apierror: apiData.apierror ?? {message: 'Failed to mark notification as read'}},
                {status: apiRes.status}
            );
        }

        return NextResponse.json(apiData);
    } catch (error) {
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}
