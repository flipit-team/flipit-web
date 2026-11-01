import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

export async function GET(req: NextRequest) {

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

        const apiData = await apiRes.json();

        if (!apiRes.ok) {
            return NextResponse.json(
                { apierror: (() => { const _e = apiData.apierror ?? apiData; return { ..._e, message: _e.debugMessage || _e.message || 'An error occurred' }; })() },
                {status: apiRes.status}
            );
        }

        return NextResponse.json(apiData);
    } catch (error) {
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}
