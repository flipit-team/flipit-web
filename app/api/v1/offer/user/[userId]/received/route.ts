import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_PATH } from '~/lib/config';
import { cookies } from 'next/headers';

// GET /api/v1/offer/user/[userId]/received - Get offers received by user
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const apiUrl = `${API_BASE_PATH}/offer/user/${userId}/received`;

    const apiRes = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!apiRes.ok) {
      const errorBody = await apiRes.text();
      return NextResponse.json(
        { error: 'Failed to fetch received offers', details: errorBody },
        { status: apiRes.status }
      );
    }

    const data = await apiRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching received offers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
