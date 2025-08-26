import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

export async function POST(req: NextRequest) {

    try {
        const body = await req.json();

        const apiUrl = `${API_BASE_PATH}/chats/message`;

        // Get token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                {apierror: {message: 'Authentication required'}},
                {status: 401}
            );
        }

        // Map frontend body to backend expected format
        const backendBody = {
            chatId: body.chatId,
            message: body.content || body.message // Accept both content and message
        };


        const apiRes = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(backendBody)
        });

        const apiData = await apiRes.json();

        if (!apiRes.ok) {
            return NextResponse.json(
                {apierror: apiData.apierror ?? {message: 'Failed to send message'}},
                {status: apiRes.status}
            );
        }

        return NextResponse.json(apiData);
    } catch (error) {
        return NextResponse.json(
            {apierror: {message: 'Internal server error'}}, 
            {status: 500}
        );
    }
}