import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

// PUT /api/v1/auction/[id]/reactivate - Reactivate deactivated auction
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const apiUrl = `${API_BASE_PATH}/auction/${id}/reactivate`;

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
            method: 'PUT',
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
                errorData = { message: 'Failed to reactivate auction' };
            }
            return NextResponse.json(
                { apierror: errorData.apierror ?? errorData },
                { status: apiRes.status }
            );
        }

        // Handle successful response
        let apiData;
        const contentType = apiRes.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            try {
                apiData = await apiRes.json();
            } catch (jsonError) {
                // If JSON parsing fails but status is ok, return success
                apiData = { message: 'Auction reactivated successfully' };
            }
        } else {
            // Non-JSON response, create success response
            apiData = { message: 'Auction reactivated successfully' };
        }

        return NextResponse.json(apiData);
    } catch (error) {
        console.error('Error reactivating auction:', error);
        return NextResponse.json(
            { apierror: { message: 'Internal server error' } },
            { status: 500 }
        );
    }
}