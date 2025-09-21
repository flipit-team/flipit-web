import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

// POST /api/v1/support/request_callback - Request support callback
export async function POST(request: NextRequest) {
    const apiUrl = `${API_BASE_PATH}/support/request_callback`;

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
        const { name, email, phoneNumber, message } = body;
        if (!name || !email || !phoneNumber || !message) {
            return NextResponse.json(
                { apierror: { message: 'Missing required fields: name, email, phoneNumber, message' } },
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
                errorData = { message: 'Failed to submit callback request' };
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
                apiData = { message: 'Callback request submitted successfully' };
            }
        } else {
            // Non-JSON response, create success response
            apiData = { message: 'Callback request submitted successfully' };
        }

        return NextResponse.json(apiData);
    } catch (error) {
        console.error('Error submitting callback request:', error);
        return NextResponse.json(
            { apierror: { message: 'Internal server error' } },
            { status: 500 }
        );
    }
}