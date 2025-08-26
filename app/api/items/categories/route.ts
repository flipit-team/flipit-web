import {NextRequest, NextResponse} from 'next/server';
import { API_BASE_PATH } from '~/lib/config';

// GET /api/items/categories - Get item categories
export async function GET(req: NextRequest) {

    try {
        const apiUrl = `${API_BASE_PATH}/items/categories`;

        const apiRes = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
                // No authentication required for categories
            },
            cache: 'no-store'
        });


        const apiData = await apiRes.json();

        if (!apiRes.ok) {
            return NextResponse.json(
                {apierror: apiData.apierror ?? {message: 'Failed to fetch categories'}},
                {status: apiRes.status}
            );
        }

        return NextResponse.json(apiData);
    } catch (error) {
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}