import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const API_BASE_URL = 'http://localhost:8080/api/v1';

    const response = await fetch(`${API_BASE_URL}/items/getCategories`);

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: `Failed to fetch categories: ${error}` }, { status: response.status });
    }

    const categories = await response.json();
    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
