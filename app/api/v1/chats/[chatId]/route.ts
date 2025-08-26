import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import { API_BASE_PATH } from '~/lib/config';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {

    const { chatId } = await params;

    const apiUrl = `${API_BASE_PATH}/chats/${chatId}`;

    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json(
            {apierror: {message: 'Authentication required'}},
            {status: 401}
        );
    }

    try {
        const apiRes = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        const apiData = await apiRes.json();

        if (!apiRes.ok) {
            return NextResponse.json(
                {apierror: apiData.apierror ?? {message: 'Failed to delete chat'}},
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