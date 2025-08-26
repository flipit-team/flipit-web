import { NextResponse } from 'next/server';
import { API_BASE_PATH, API_BASE_URL } from '~/lib/config';

export async function GET() {
  const connectionInfo = {
    API_BASE_PATH,
    API_BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  };


  // Test connection to the backend
  try {
    const testUrl = `${API_BASE_PATH}/items/categories`;
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const responseInfo = {
      url: testUrl,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    };

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        success: true,
        connectionInfo,
        response: responseInfo,
        sampleData: data
      });
    } else {
      const errorText = await response.text();
      return NextResponse.json({
        success: false,
        connectionInfo,
        response: responseInfo,
        error: errorText
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      connectionInfo,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}