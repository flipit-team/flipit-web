import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {API_BASE_PATH} from '~/lib/config';

export async function GET(req: NextRequest) {
    try {
        const apiUrl = `${API_BASE_PATH}/home/top_nav`;

        // Get token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                {apierror: {message: 'Authentication required'}},
                {status: 401}
            );
        }

        const apiRes = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store'
        });

        if (!apiRes.ok) {
            const apiData = await apiRes.json().catch(() => ({}));
            return NextResponse.json(
                {apierror: apiData.apierror ?? {message: 'Failed to fetch top nav counters'}},
                {status: apiRes.status}
            );
        }

        // Check if response has content
        const text = await apiRes.text();

        if (!text) {
            // Backend returns empty response - return dummy data for testing
            // TODO: Backend needs to return proper JSON response
            return NextResponse.json({
                auctionsCount: 5,
                messagesCount: 12,
                biddingCount: 3,
                notificationsCount: 8
            });
        }

        const apiData = JSON.parse(text);
        return NextResponse.json(apiData);
    } catch (error) {
        return NextResponse.json(
            {apierror: {message: error instanceof Error ? error.message : 'Internal server error'}},
            {status: 500}
        );
    }
}
