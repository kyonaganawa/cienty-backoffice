import { NextRequest, NextResponse } from 'next/server';

/**
 * TEMPORARY PLACEHOLDER FOR DEVELOPMENT
 *
 * This route proxies authentication to the staging API to get real access tokens
 * while developing the platform. This allows admin access to staging environment.
 *
 * TODO: Replace with proper authentication implementation when backend is ready
 *
 * Staging API: https://api-stg.covalenty.com.br/app/auth/login
 */

const STAGING_API_URL = 'https://api-stg.covalenty.com.br/app/auth/login';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Call staging API for authentication
    const response = await fetch(STAGING_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Invalid credentials' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the staging API response
    // Expected format: { user: {...}, token: string, refreshToken?: string }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to authentication service' },
      { status: 500 }
    );
  }
}
