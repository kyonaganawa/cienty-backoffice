import { NextRequest, NextResponse } from 'next/server';
import { mockDistribuidoras } from '@/lib/mock-data/distribuidoras';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const distribuidora = mockDistribuidoras.find((d) => d.id === id);

  if (!distribuidora) {
    return NextResponse.json(
      { error: 'Distribuidora não encontrada' },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: distribuidora });
}
