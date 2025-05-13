import {NextRequest, NextResponse} from 'next/server';
import {API_BASE_PATH} from '~/lib/config';

export async function POST(req: NextRequest) {
    const email = req.nextUrl.searchParams.get('email') ?? '';

    // replace with your real auth logic
    const response = await fetch(`${API_BASE_PATH}/auth/forgot-password?email=${email}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    });
    console.log(response, 98889);

    const data = await response.text();

    if (!response.ok) {
        return NextResponse.json({apierror: data}, {status: response.status});
    }

    const res = NextResponse.json({message: data}, {status: 200});

    return res;
}
