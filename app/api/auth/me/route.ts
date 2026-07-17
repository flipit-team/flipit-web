import {NextRequest, NextResponse} from 'next/server';
import {API_BASE_PATH} from '~/lib/config';
import {cookies} from 'next/headers';

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json({isAuthenticated: false});
    }

    try {
        const profileResponse = await fetch(`${API_BASE_PATH}/user/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!profileResponse.ok) {
            return NextResponse.json({isAuthenticated: false});
        }

        const userProfile = await profileResponse.json();

        return NextResponse.json({
            isAuthenticated: true,
            user: userProfile
        });
    } catch (error) {
        return NextResponse.json({isAuthenticated: false});
    }
}
