import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

export async function GET(req: NextRequest) {

    try {
        // Get token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        
        if (!token) {
            return NextResponse.json({
                authenticated: false,
                error: 'No token found in cookies'
            });
        }

        // Test token validity by calling a protected endpoint
        const testUrl = `${API_BASE_PATH}/user/profile`;

        const res = await fetch(testUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        
        if (res.ok) {
            const userData = await res.json();
            return NextResponse.json({
                authenticated: true,
                user: userData,
                tokenValid: true
            });
        } else {
            const errorText = await res.text();
            return NextResponse.json({
                authenticated: false,
                tokenValid: false,
                error: `Token validation failed: ${res.status} - ${errorText}`
            });
        }

    } catch (error) {
        return NextResponse.json({
            authenticated: false,
            error: `Auth check failed: ${error}`
        });
    }
}