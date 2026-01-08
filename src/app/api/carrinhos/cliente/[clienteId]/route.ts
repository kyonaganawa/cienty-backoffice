import { NextRequest, NextResponse } from 'next/server';
import { mockCarrinhos } from '@/lib/mock-data/carrinhos';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clienteId: string }> }
) {
  const { clienteId } = await params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let carrinhos = mockCarrinhos.filter((c) => c.clienteId === clienteId);

  // Filter by userId if provided
  if (userId) {
    carrinhos = carrinhos.filter((c) => c.userId === userId);
  }

  return NextResponse.json({
    data: carrinhos,
    total: carrinhos.length,
  });
}
