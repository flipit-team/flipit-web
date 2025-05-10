import {cookies} from 'next/headers';
import {NextRequest, NextResponse} from 'next/server';
import {API_BASE_PATH} from '~/lib/config';

export async function PUT(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get('userId') ?? '0';

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const body = await req.json();

    try {
        const res = await fetch(`${API_BASE_PATH}/user/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token && {Authorization: `Bearer ${token}`}) // Include token only if it exists
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const errorBody = await res.text();
            return NextResponse.json({error: 'Failed to update user', details: errorBody}, {status: res.status});
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error creating item:', error);
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}
