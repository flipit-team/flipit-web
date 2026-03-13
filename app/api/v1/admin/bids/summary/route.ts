import {NextRequest, NextResponse} from 'next/server';

const API_BASE_URL = process.env.API_BASE_PATH || 'https://api.flipit.ng/api/v1';

export async function GET(request: NextRequest) {
    try {
        const token =
            request.cookies.get('auth_token')?.value ||
            request.cookies.get('jwt')?.value ||
            request.headers.get('authorization')?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({error: 'Unauthorized', message: 'Authentication required'}, {status: 401});
        }

        const response = await fetch(`${API_BASE_URL}/admin/bids/summary`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(errorData || {error: 'Failed to fetch bids summary'}, {status: response.status});
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching bids summary:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Failed to fetch bids summary'},
            {status: 500}
        );
    }
}
