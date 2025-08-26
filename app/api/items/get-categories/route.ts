// /app/api/items/route.ts

import {cookies} from 'next/headers';
import {NextRequest, NextResponse} from 'next/server';
import { API_BASE_PATH } from '~/lib/config';

export async function GET(req: NextRequest) {
    const apiUrl = `${API_BASE_PATH}/items/categories`;

    try {
        const res = await fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/json'
                // ...(token && {Authorization: `Bearer ${token}`})
            },
            cache: 'no-store'
        });


        if (!res.ok) {
            const errorText = await res.text();
            return NextResponse.json({error: 'Failed to fetch categories'}, {status: res.status});
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}
