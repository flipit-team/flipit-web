import { NextRequest, NextResponse } from 'next/server';
import { checkAuthServerSide } from '~/lib/server-api';

export async function GET(req: NextRequest) {
    try {
        const authStatus = await checkAuthServerSide();
        
        // If token is invalid, clear the cookies
        if ((authStatus as any).clearCookies) {
            const response = NextResponse.json({ isAuthenticated: false, user: null });
            
            // Clear authentication cookies
            response.cookies.set('token', '', { expires: new Date(0), path: '/' });
            response.cookies.set('userId', '', { expires: new Date(0), path: '/' });
            response.cookies.set('userName', '', { expires: new Date(0), path: '/' });
            
            return response;
        }
        
        return NextResponse.json(authStatus);
    } catch (error) {
        return NextResponse.json(
            { isAuthenticated: false, user: null }, 
            { status: 500 }
        );
    }
}