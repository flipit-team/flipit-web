// app/api/auth/callback/route.ts
import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const {code} = await req.json();

        // Send code to your backend to exchange for token
        const res = await fetch('https://flipit-api.onrender.com/api/v1/auth/google/callback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({code})
        });

        const data = await res.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Google callback error:', error);
        return NextResponse.json({error: 'Failed to complete Google login'}, {status: 500});
    }
}
