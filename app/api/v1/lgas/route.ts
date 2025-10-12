import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_PATH } from '~/lib/config';

// GET /api/v1/lgas - Get all LGAs or filter by state
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stateCode = searchParams.get('stateCode');

    let apiUrl = `${API_BASE_PATH}/lgas`;
    if (stateCode) {
      apiUrl = `${API_BASE_PATH}/lgas/state/${stateCode}`;
    }

    const apiRes = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache', // Cache LGAs as they don't change often
    });

    if (!apiRes.ok) {
      const errorBody = await apiRes.text();
      return NextResponse.json(
        { error: 'Failed to fetch LGAs', details: errorBody },
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
