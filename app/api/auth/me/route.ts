import {NextRequest, NextResponse} from 'next/server';
import { API_BASE_URL } from '~/lib/config';

export async function GET(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const userId = req.cookies.get('userId')?.value;

    if (!token) {
        return NextResponse.json({isAuthenticated: false});
    }

    // Call external API to verify the token
    try {
        const response = await fetch(`${API_BASE_URL}/checkJwt`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            credentials: 'include' // Include cookies if needed
        });

        if (response.ok) {
            return NextResponse.json({isAuthenticated: true, userId: userId, token});
        } else {
            return NextResponse.json({isAuthenticated: false});
        }
    } catch (error) {
        console.error('Error verifying JWT:', error);
        return NextResponse.json({isAuthenticated: false});
    }
}
