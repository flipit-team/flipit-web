import {NextRequest, NextResponse} from 'next/server';
import { API_BASE_PATH } from '~/lib/config';

export async function GET(request: NextRequest) {
    try {
        const token =
            request.cookies.get('token')?.value ||
            request.headers.get('authorization')?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({error: 'Unauthorized', message: 'Authentication required'}, {status: 401});
        }

        const response = await fetch(`${API_BASE_PATH}/admin/customers/summary`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(errorData || {error: 'Failed to fetch customers summary'}, {
                status: response.status
            });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching customers summary:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Failed to fetch customers summary'},
            {status: 500}
        );
    }
}
