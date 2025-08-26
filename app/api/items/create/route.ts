// app/api/items/create/route.ts
import {cookies} from 'next/headers';
import {NextRequest, NextResponse} from 'next/server';
import { API_BASE_PATH } from '~/lib/config';

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const body = await req.json();
    

    try {
        const backendUrl = `${API_BASE_PATH}/items`;
        
        const res = await fetch(backendUrl, {
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
        
        // Verify the item was created by trying to fetch it back
        try {
            const verifyRes = await fetch(`${API_BASE_PATH}/items?page=0&size=1`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && {Authorization: `Bearer ${token}`})
                },
            });
            if (verifyRes.ok) {
                const verifyData = await verifyRes.json();
            }
        } catch (e) {
        }
        
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}
