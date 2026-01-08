import { NextRequest, NextResponse } from 'next/server';
import { mockColecoes } from '@/lib/mock-data/colecoes';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const colecao = mockColecoes.find((c) => c.id === id);

  if (!colecao) {
    return NextResponse.json(
      { error: 'Coleção não encontrada' },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: colecao });
}
