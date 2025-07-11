import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

export async function GET(req: NextRequest) {
    console.log('✅ /api/items/get-items HIT');

    const chatId = req.nextUrl.searchParams.get('chatId');
    const apiUrl = `${API_BASE_PATH}/chats/${chatId}/messages`;

    // ✅ Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    try {
        const apiRes = await fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && {Authorization: `Bearer ${token}`})
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
