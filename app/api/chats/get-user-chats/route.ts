import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {API_BASE_PATH} from '~/lib/config';

export async function GET(req: NextRequest) {
    console.log('✅ /api/chats/get-user-chats HIT');

    const apiUrl = `${API_BASE_PATH}/chats`;

    // ✅ Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    console.log('Token:', token);
    
    try {
        const apiRes = await fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && {Authorization: `Bearer ${token}`})
            },
            cache: 'no-store'
        });
        console.log('API Response status:', apiRes.status);

        const apiData = await apiRes.json();

        if (!apiRes.ok) {
            console.error('API Error:', apiData);
            return NextResponse.json(
                {apierror: apiData.apierror ?? {message: 'Failed to fetch chats'}},
                {status: apiRes.status}
            );
        }

        return NextResponse.json(apiData);
    } catch (error) {
        console.error('❌ Error fetching chats:', error);
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}
