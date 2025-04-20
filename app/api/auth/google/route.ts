// app/api/auth/google/route.ts
import {NextResponse} from 'next/server';

export async function GET() {
    try {
        const res = await fetch('https://flipit-api.onrender.com/api/v1/auth/login/google', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const text = await res.text();

        // optional: log to verify
        console.log('Received Google URL:', text);

        // send it back as a JSON payload
        return NextResponse.json({url: text});
    } catch (error) {
        console.error('Google login proxy error:', error);
        return NextResponse.json({error: 'Proxy error: ' + String(error)}, {status: 500});
    }
}
