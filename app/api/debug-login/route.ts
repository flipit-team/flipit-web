import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('🔍 Debug Login Request Body:', body);

    // Mock successful login response that matches your API format
    const mockResponse = {
      jwt: 'mock-jwt-token-12345',
      user: {
        id: 1,
        username: body.username,
        email: body.username,
        firstName: 'Test',
        middleName: null,
        lastName: 'User',
        phoneNumber: '+2348012345678',
        title: null,
        avatar: null,
        avgRating: 0.0,
        reviewCount: 0,
        status: 'Registered',
        mostRecentReview: null,
        phoneNumberVerified: false,
        dateVerified: null,
        dateCreated: new Date().toISOString()
      }
    };

    console.log('🎯 Mock Response:', mockResponse);

    const res = NextResponse.json({ message: mockResponse }, { status: 200 });
    
    const token = mockResponse.jwt;
    const user = mockResponse.user;
    
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    res.cookies.set('userId', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });
    
    res.cookies.set('userName', user.firstName || user.username || user.email || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return res;
  } catch (error) {
    console.error('Debug login error:', error);
    return NextResponse.json({ error: 'Debug login failed' }, { status: 500 });
  }
}