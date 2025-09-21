import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

// POST /api/v1/reviews - Create user review
export async function POST(request: NextRequest) {
    const apiUrl = `${API_BASE_PATH}/reviews`;

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
        const body = await request.json();

        // Validate required fields
        const { rating, message, userId } = body;
        if (!rating || !message || !userId) {
            return NextResponse.json(
                { apierror: { message: 'Missing required fields: rating, message, userId' } },
                { status: 400 }
            );
        }

        // Validate rating range
        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { apierror: { message: 'Rating must be between 1 and 5' } },
                { status: 400 }
            );
        }

        const apiRes = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body),
            cache: 'no-store'
        });

        // Check if response is successful first
        if (!apiRes.ok) {
            let errorData;
            try {
                errorData = await apiRes.json();
            } catch {
                errorData = { message: 'Failed to create review' };
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
                apiData = { message: 'Review created successfully' };
            }
        } else {
            // Non-JSON response, create success response
            apiData = { message: 'Review created successfully' };
        }

        return NextResponse.json(apiData);
    } catch (error) {
        console.error('Error creating review:', error);
        return NextResponse.json(
            { apierror: { message: 'Internal server error' } },
            { status: 500 }
        );
    }
}