import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';
import { wrapAsPaginated } from '~/lib/pagination';

// GET /api/items - Get items with filtering and pagination
export async function GET(req: NextRequest) {

    try {
        // Extract query parameters
        const { searchParams } = new URL(req.url);
        const page = searchParams.get('page') || '0';
        const size = searchParams.get('size') || '15';
        const search = searchParams.get('search') || '';
        const sort = searchParams.get('sort');
        const category = searchParams.get('category');
        const subcategory = searchParams.get('subcategory');
        const stateCode = searchParams.get('stateCode');
        const lgaCode = searchParams.get('lgaCode');
        const minAmount = searchParams.get('minAmount');
        const maxAmount = searchParams.get('maxAmount');
        const isVerifiedSeller = searchParams.get('isVerifiedSeller');
        const hasDiscount = searchParams.get('hasDiscount');

        // Build query string for backend
        const backendParams = new URLSearchParams();
        backendParams.set('page', page);
        backendParams.set('size', size);
        if (search) backendParams.set('search', search);
        if (sort) backendParams.set('sort', sort);
        if (category) backendParams.set('category', category);
        if (subcategory) backendParams.set('subcategory', subcategory);
        if (stateCode) backendParams.set('stateCode', stateCode);
        if (lgaCode) backendParams.set('lgaCode', lgaCode);
        if (minAmount) backendParams.set('minAmount', minAmount);
        if (maxAmount) backendParams.set('maxAmount', maxAmount);
        if (isVerifiedSeller) backendParams.set('isVerifiedSeller', isVerifiedSeller);
        if (hasDiscount) backendParams.set('hasDiscount', hasDiscount);

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

        // If we get 401 with a token, retry without authentication (items endpoint is public)
        if (!apiRes.ok && apiRes.status === 401 && token) {
            const retryRes = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                cache: 'no-store'
            });

            const retryData = await retryRes.json();

            if (!retryRes.ok) {
                return NextResponse.json(
                    {apierror: retryData.apierror ?? {message: 'Failed to fetch items'}},
                    {status: retryRes.status}
                );
            }

            // If backend returns an array, transform it to paginated format
            if (Array.isArray(retryData)) {
                return NextResponse.json(wrapAsPaginated(retryData, parseInt(page), parseInt(size)));
            }

            return NextResponse.json(retryData);
        }

        const apiData = await apiRes.json();

        if (!apiRes.ok) {
            return NextResponse.json(
                {apierror: apiData.apierror ?? {message: 'Failed to fetch items'}},
                {status: apiRes.status}
            );
        }

        // If backend returns an array, transform it to paginated format
        if (Array.isArray(apiData)) {
            return NextResponse.json(wrapAsPaginated(apiData, parseInt(page), parseInt(size)));
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