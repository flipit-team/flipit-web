// app/api/items/create/route.ts
import {cookies} from 'next/headers';
import {NextRequest, NextResponse} from 'next/server';
import { API_BASE_PATH } from '~/lib/config';

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const body = await req.json();
    
    console.log('📤 Creating offer with payload:', body);
    console.log('🔗 API endpoint:', `${API_BASE_PATH}/offer`);
    console.log('🔑 Token present:', !!token);

    try {
        const res = await fetch(`${API_BASE_PATH}/offer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && {Authorization: `Bearer ${token}`}) // Include token only if it exists
            },
            body: JSON.stringify(body)
        });
        
        console.log('📥 Response status:', res.status);
        console.log('📥 Response headers:', Object.fromEntries(res.headers.entries()));

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
