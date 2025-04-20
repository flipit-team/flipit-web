// app/api/items/create/route.ts
import {cookies} from 'next/headers';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const body = await req.json();

    try {
        const res = await fetch('https://flipit-api.onrender.com/api/v1/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && {Authorization: `Bearer ${token}`}) // Include token only if it exists
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const errorBody = await res.text();
            return NextResponse.json({error: 'Failed to create item', details: errorBody}, {status: res.status});
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error creating item:', error);
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}
