// app/api/items/create/route.ts
import {cookies} from 'next/headers';
import {NextRequest, NextResponse} from 'next/server';
import {API_BASE_PATH} from '~/lib/config';

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    try {
        const res = await fetch(`${API_BASE_PATH}/user/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token && {Authorization: `Bearer ${token}`}) // Include token only if it exists
            }
        });

        if (!res.ok) {
            const errorBody = await res.text();
            return NextResponse.json({error: 'Failed to get profile', details: errorBody}, {status: res.status});
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error creating item:', error);
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}
