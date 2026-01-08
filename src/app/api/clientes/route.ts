import { NextRequest, NextResponse } from 'next/server';

/**
 * TEMPORARY PLACEHOLDER FOR DEVELOPMENT
 *
 * This route proxies client list requests to the staging API.
 * Uses the authentication token from the request headers.
 *
 * TODO: Update endpoint URL when production backend is ready
 *
 * Staging API: https://api-stg.covalenty.com.br/app/clients
 */

const STAGING_API_URL = 'https://api-stg.covalenty.com.br/app/clients';

export async function GET(request: NextRequest) {
  try {
    // Get the authorization token from the request headers
    const authHeader = request.headers.get('authorization');

    console.info('[/api/clientes] Authorization header:', authHeader ? `Present (${authHeader.substring(0, 30)}...)` : 'Missing');

    if (!authHeader) {
      console.error('[/api/clientes] No authorization header provided');
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    // Forward the request to the staging API
    console.info('[/api/clientes] Forwarding request to staging API...');
    const response = await fetch(STAGING_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    console.info('[/api/clientes] Staging API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[/api/clientes] Staging API error:', response.status, errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch clients' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the staging API response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to connect to API service' },
      { status: 500 }
    );
  }
}
