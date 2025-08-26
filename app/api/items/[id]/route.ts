import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

// GET /api/items/{id} - Get specific item
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;

    try {
        const apiUrl = `${API_BASE_PATH}/items/${id}`;

        // Get token from cookies (optional for public item viewing)
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
                {apierror: apiData.apierror ?? {message: 'Failed to fetch item'}},
                {status: apiRes.status}
            );
        }

        return NextResponse.json(apiData);
    } catch (error) {
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}

// PUT /api/items/{id} - Update item
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;

    try {
        const body = await req.json();

        const apiUrl = `${API_BASE_PATH}/items/${id}`;

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
            method: 'PUT',
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
                {apierror: apiData.apierror ?? {message: 'Failed to update item'}},
                {status: apiRes.status}
            );
        }

        return NextResponse.json(apiData);
    } catch (error) {
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}

// DELETE /api/items/{id} - Delete item
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;

    try {
        console.log('Attempting to delete item with ID:', id);
        const apiUrl = `${API_BASE_PATH}/items/${id}`;
        console.log('Backend API URL:', apiUrl);

        // Get token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            console.log('No authentication token found');
            return NextResponse.json(
                {error: 'Authentication required'}, 
                {status: 401}
            );
        }

        console.log('Making delete request to backend...');
        const apiRes = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            cache: 'no-store'
        });

        console.log('Backend response status:', apiRes.status);

        // Check if response is JSON
        const contentType = apiRes.headers.get('content-type');
        let apiData;
        
        if (contentType && contentType.includes('application/json')) {
            apiData = await apiRes.json();
        } else {
            // If not JSON, get text response
            const textResponse = await apiRes.text();
            console.log('Non-JSON response:', textResponse);
            apiData = { message: textResponse || 'Item deleted successfully' };
        }

        console.log('Backend response data:', apiData);

        if (!apiRes.ok) {
            console.log('Backend returned error status:', apiRes.status);
            return NextResponse.json(
                {apierror: apiData.apierror ?? {message: 'Failed to delete item'}},
                {status: apiRes.status}
            );
        }

        console.log('Delete request successful');
        return NextResponse.json(apiData);
    } catch (error) {
        console.error('Delete API error:', error);
        return NextResponse.json({error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error'}, {status: 500});
    }
}