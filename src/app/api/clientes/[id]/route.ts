import { NextRequest, NextResponse } from 'next/server';

/**
 * TEMPORARY PLACEHOLDER FOR DEVELOPMENT
 *
 * This route proxies individual client requests to the staging API.
 * Uses the authentication token from the request headers.
 *
 * TODO: Update endpoint URL when production backend is ready
 *
 * Staging API: https://api-stg.covalenty.com.br/app/clients/:clientId
 */

const STAGING_API_BASE_URL = 'https://api-stg.covalenty.com.br/app/clients';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the authorization token from the request headers
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    // Forward the request to the staging API
    const response = await fetch(`${STAGING_API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Cliente não encontrado' },
          { status: 404 }
        );
      }

      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch client details' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the staging API response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching client details:', error);
    return NextResponse.json(
      { error: 'Failed to connect to API service' },
      { status: 500 }
    );
  }
}
