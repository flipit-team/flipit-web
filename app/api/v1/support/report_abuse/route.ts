import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

// POST /api/v1/support/report_abuse - Report abusive content/users
export async function POST(request: NextRequest) {
    const apiUrl = `${API_BASE_PATH}/support/report_abuse`;

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
        const { reportType, reason, description } = body;
        if (!reportType || !reason || !description) {
            return NextResponse.json(
                { apierror: { message: 'Missing required fields: reportType, reason, description' } },
                { status: 400 }
            );
        }

        // Validate reportType
        const validReportTypes = ['USER', 'ITEM', 'OTHER'];
        if (!validReportTypes.includes(reportType)) {
            return NextResponse.json(
                { apierror: { message: 'Invalid reportType. Must be one of: USER, ITEM, OTHER' } },
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
                errorData = { message: 'Failed to submit abuse report' };
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
                apiData = { message: 'Abuse report submitted successfully' };
            }
        } else {
            // Non-JSON response, create success response
            apiData = { message: 'Abuse report submitted successfully' };
        }

        return NextResponse.json(apiData);
    } catch (error) {
        console.error('Error submitting abuse report:', error);
        return NextResponse.json(
            { apierror: { message: 'Internal server error' } },
            { status: 500 }
        );
    }
}