// app/api/items/create/route.ts
import {cookies} from 'next/headers';
import {NextRequest, NextResponse} from 'next/server';
import {API_BASE_PATH} from '~/lib/config';

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    
    if (!token) {
        return NextResponse.json({
            isAuthenticated: false,
            user: null
        });
    }

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
            
            // Return unauthenticated if backend rejects the token
            if (res.status === 401 || res.status === 403) {
                return NextResponse.json({
                    isAuthenticated: false,
                    user: null
                });
            }
            
            return NextResponse.json({error: 'Failed to get profile', details: errorBody}, {status: res.status});
        }

        const userData = await res.json();
        
        // Return in the format expected by useAuth hook
        return NextResponse.json({
            isAuthenticated: true,
            user: userData
        });
    } catch (error) {
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}
