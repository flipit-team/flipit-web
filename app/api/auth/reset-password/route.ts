import {NextResponse} from 'next/server';
import {API_BASE_PATH} from '~/lib/config';

export async function POST(req: Request) {
    const body = await req.json();

    const response = await fetch(`${API_BASE_PATH}/auth/reset-password`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    });

    const data = await response.text();

    if (!response.ok) {
        let apierror;
        try {
            apierror = JSON.parse(data);
        } catch {
            apierror = {message: data};
        }
        return NextResponse.json({apierror}, {status: response.status});
    }

    return NextResponse.json({message: 'Password reset successfully'}, {status: 200});
}
