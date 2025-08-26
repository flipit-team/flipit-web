import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

// GET /api/items - Get items with filtering and pagination
export async function GET(req: NextRequest) {

    try {
        // Extract query parameters
        const { searchParams } = new URL(req.url);
        const page = searchParams.get('page') || '0';
        const size = searchParams.get('size') || '15';
        const search = searchParams.get('search') || '';
        const categories = searchParams.getAll('categories[]');

        // Build query string for backend
        const backendParams = new URLSearchParams();
        backendParams.set('page', page);
        backendParams.set('size', size);
        if (search) backendParams.set('search', search);
        categories.forEach(cat => backendParams.append('categories[]', cat));

        const apiUrl = `${API_BASE_PATH}/items?${backendParams.toString()}`;

        // Get token from cookies (optional for public items)
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;


        const apiRes = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            cache: 'no-store'
        });


        const apiData = await apiRes.json();

        if (!apiRes.ok) {
            return NextResponse.json(
                {apierror: apiData.apierror ?? {message: 'Failed to fetch items'}},
                {status: apiRes.status}
            );
        }

        return NextResponse.json(apiData);
    } catch (error) {
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}

// POST /api/items - Create new item
export async function POST(req: NextRequest) {

    try {
        const body = await req.json();

        const apiUrl = `${API_BASE_PATH}/items`;

        // Get token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                {error: 'Authentication required'}, 
                {status: 401}
            );
        }

        const apiRes = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body),
            cache: 'no-store'
        });


        const apiData = await apiRes.json();

        if (!apiRes.ok) {
            return NextResponse.json(
                {apierror: apiData.apierror ?? {message: 'Failed to create item'}},
                {status: apiRes.status}
            );
        }

        return NextResponse.json(apiData);
    } catch (error) {
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}