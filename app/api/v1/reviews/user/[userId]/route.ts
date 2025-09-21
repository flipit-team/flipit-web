import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_PATH } from '~/lib/config';

// GET /api/v1/reviews/user/[userId] - Get reviews for specific user
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;
    const apiUrl = `${API_BASE_PATH}/reviews/user/${userId}`;

    try {
        const apiRes = await fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });

        const apiData = await apiRes.json();

        if (!apiRes.ok) {
            return NextResponse.json(
                { apierror: apiData.apierror ?? { message: 'Failed to fetch user reviews' } },
                { status: apiRes.status }
            );
        }

        return NextResponse.json(apiData);
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        return NextResponse.json(
            { apierror: { message: 'Internal server error' } },
            { status: 500 }
        );
    }
}