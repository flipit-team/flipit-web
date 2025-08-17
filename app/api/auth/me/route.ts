import {NextRequest, NextResponse} from 'next/server';
import { API_BASE_URL } from '~/lib/config';

export async function GET(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const userId = req.cookies.get('userId')?.value;
    const userName = req.cookies.get('userName')?.value;

    console.log('Auth check - cookies:', { token: !!token, userId, userName });

    if (!token) {
        console.log('No token found, user not authenticated');
        return NextResponse.json({isAuthenticated: false});
    }

    // Call external API to verify the token and get user profile
    try {
        // First verify the token
        const verifyResponse = await fetch(`${API_BASE_URL}/checkJwt`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!verifyResponse.ok) {
            console.log('Token verification failed');
            return NextResponse.json({isAuthenticated: false});
        }

        // Get user profile data
        let userProfile = null;
        try {
            const profileResponse = await fetch(`${API_BASE_URL}/user/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (profileResponse.ok) {
                userProfile = await profileResponse.json();
            }
        } catch (profileError) {
            console.warn('Failed to fetch user profile:', profileError);
        }

        // Return user data - use profile data if available, otherwise use cookie data
        const userData = userProfile || {
            id: parseInt(userId || '0'),
            username: userName || '',
            email: '',
            firstName: userName || '',
            lastName: '',
            phone: '',
            dateCreated: new Date().toISOString()
        };

        return NextResponse.json({
            isAuthenticated: true,
            user: userData
        });
        
    } catch (error) {
        console.error('Error verifying JWT:', error);
        return NextResponse.json({isAuthenticated: false});
    }
}
