// app/api/items/create/route.ts
import {cookies} from 'next/headers';
import {NextRequest, NextResponse} from 'next/server';
import { API_BASE_PATH } from '~/lib/config';

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const body = await req.json();
    
    console.log('🎯 API Route - Create Item Request:', body);
    console.log('🔑 Token present:', !!token);

    try {
        const backendUrl = `${API_BASE_PATH}/items`;
        console.log('🌐 Calling backend URL:', backendUrl);
        
        const res = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && {Authorization: `Bearer ${token}`}) // Include token only if it exists
            },
            body: JSON.stringify(body)
        });

        console.log('📡 Backend response status:', res.status);
        console.log('📡 Backend response headers:', Object.fromEntries(res.headers.entries()));

        if (!res.ok) {
            const errorBody = await res.text();
            console.error('❌ Backend error response:', errorBody);
            return NextResponse.json({error: 'Failed to create item', details: errorBody}, {status: res.status});
        }

        const data = await res.json();
        console.log('✅ Backend success response:', data);
        console.log('✅ Created item ID:', data.id);
        console.log('✅ Created item title:', data.title);
        
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
                console.log('🔍 Verification: Latest items after creation:', verifyData);
            }
        } catch (e) {
            console.log('⚠️ Could not verify item creation:', e);
        }
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('💥 Error creating item:', error);
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}
