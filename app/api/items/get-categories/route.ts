// /app/api/items/route.ts

import {cookies} from 'next/headers';
import {NextRequest, NextResponse} from 'next/server';

export async function GET(req: NextRequest) {
    const apiUrl = `https://flipit-api.onrender.com/api/v1/auth/categories`;

    try {
        const res = await fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/json'
                // ...(token && {Authorization: `Bearer ${token}`})
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            return NextResponse.json({error: 'Failed to fetch items'}, {status: res.status});
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching items:', error);
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}
