import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_PATH } from '~/lib/config';

// GET /api/v1/states - Get all states
export async function GET(req: NextRequest) {
  try {
    const apiUrl = `${API_BASE_PATH}/state`;

    const apiRes = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache', // Cache states as they don't change often
    });

    if (!apiRes.ok) {
      const errorBody = await apiRes.text();
      return NextResponse.json(
        { error: 'Failed to fetch states', details: errorBody },
        { status: apiRes.status }
      );
    }

    const data = await apiRes.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
