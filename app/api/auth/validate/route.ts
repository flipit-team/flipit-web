import { NextRequest, NextResponse } from 'next/server';
import { checkAuthServerSide } from '~/lib/server-api';

export async function GET(req: NextRequest) {
    try {
        console.log('🔍 Auth validation endpoint called');
        const authStatus = await checkAuthServerSide();
        
        console.log('🔍 Auth validation result:', {
            isAuthenticated: authStatus.isAuthenticated,
            hasUser: !!authStatus.user
        });
        
        return NextResponse.json(authStatus);
    } catch (error) {
        console.error('🔍 Auth validation error:', error);
        return NextResponse.json(
            { isAuthenticated: false, user: null }, 
            { status: 500 }
        );
    }
}