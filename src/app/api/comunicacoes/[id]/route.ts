import { NextRequest, NextResponse } from 'next/server';
import { mockComunicacoes } from '@/lib/mock-data/comunicacoes';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const comunicacao = mockComunicacoes.find((c) => c.id === id);

  if (!comunicacao) {
    return NextResponse.json(
      { error: 'Comunicação não encontrada' },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: comunicacao });
}
