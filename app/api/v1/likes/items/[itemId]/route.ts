import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

// POST /api/v1/likes/items/[itemId] - Like an item
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ itemId: string }> }
) {
    const { itemId } = await params;
    const apiUrl = `${API_BASE_PATH}/likes/items/${itemId}`;

    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json(
            { apierror: { message: 'Authentication required' } },
            { status: 401 }
        );
    }

    try {
        const apiRes = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: '',
            cache: 'no-store'
        });

        // Check if response is successful first
        if (!apiRes.ok) {
            let errorData;
            try {
                errorData = await apiRes.json();
            } catch {
                errorData = { message: 'Failed to like item' };
            }
            return NextResponse.json(
                { apierror: errorData.apierror ?? errorData },
                { status: apiRes.status }
            );
        }

        // Handle successful response - might be empty or JSON
        let apiData;
        const contentType = apiRes.headers.get('content-type');
        console.log('POST Like - Status:', apiRes.status, 'Content-Type:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
            try {
                apiData = await apiRes.json();
                console.log('POST Like - Response data:', apiData);
            } catch (jsonError) {
                console.log('POST Like - JSON parsing failed:', jsonError);
                // If JSON parsing fails but status is ok, return success
                apiData = { message: 'Item liked successfully' };
            }
        } else {
            // Non-JSON response, create success response
            console.log('POST Like - Non-JSON response, creating success response');
            apiData = { message: 'Item liked successfully' };
        }

        return NextResponse.json(apiData);
    } catch (error) {
        console.error('Error liking item:', error);
        return NextResponse.json(
            { apierror: { message: 'Internal server error' } },
            { status: 500 }
        );
    }
}

// DELETE /api/v1/likes/items/[itemId] - Unlike an item
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ itemId: string }> }
) {
    const { itemId } = await params;
    const apiUrl = `${API_BASE_PATH}/likes/items/${itemId}`;

    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json(
            { apierror: { message: 'Authentication required' } },
            { status: 401 }
        );
    }

    try {
        const apiRes = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store'
        });

        // Check if response is successful first
        if (!apiRes.ok) {
            let errorData;
            try {
                errorData = await apiRes.json();
            } catch {
                errorData = { message: 'Failed to unlike item' };
            }
            return NextResponse.json(
                { apierror: errorData.apierror ?? errorData },
                { status: apiRes.status }
            );
        }

        // Handle successful response - might be empty or JSON
        let apiData;
        const contentType = apiRes.headers.get('content-type');
        console.log('DELETE Unlike - Status:', apiRes.status, 'Content-Type:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
            try {
                apiData = await apiRes.json();
                console.log('DELETE Unlike - Response data:', apiData);
            } catch (jsonError) {
                console.log('DELETE Unlike - JSON parsing failed:', jsonError);
                // If JSON parsing fails but status is ok, return success
                apiData = { message: 'Item unliked successfully' };
            }
        } else {
            // Non-JSON response, create success response
            console.log('DELETE Unlike - Non-JSON response, creating success response');
            apiData = { message: 'Item unliked successfully' };
        }

        return NextResponse.json(apiData);
    } catch (error) {
        console.error('Error unliking item:', error);
        return NextResponse.json(
            { apierror: { message: 'Internal server error' } },
            { status: 500 }
        );
    }
}