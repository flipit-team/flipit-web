import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

export async function GET(req: NextRequest) {
    console.log('✅ /api/bids/get-user-bids HIT');

    const userId = req.nextUrl.searchParams.get('userId');
    
    console.log('📥 Get user bids - userId from query:', userId);
    
    // Validate userId
    if (!userId || userId === 'null' || userId === 'undefined') {
        console.error('❌ Get user bids - Invalid userId:', userId);
        return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
        );
    }
    
    const apiUrl = `${API_BASE_PATH}/offer/user/${userId}/offers`;
    console.log('🔗 Get user bids - API URL:', apiUrl);

    // ✅ Get token from cookies
    const cookieStore = await cookies(); // ← must await!
    const token = cookieStore.get('token')?.value;

    try {
        const apiRes = await fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && {Authorization: `Bearer ${token}`}) // Include token only if it exists
            },
            cache: 'no-store'
        });
        console.log(apiRes, 999);

        const apiData = await apiRes.json();

        if (!apiRes.ok) {
            return NextResponse.json(
                {apierror: apiData.apierror ?? {message: 'Failed to fetch items'}},
                {status: apiRes.status}
            );
        }

        return NextResponse.json(apiData);
    } catch (error) {
        console.error('❌ Error fetching items:', error);
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}
