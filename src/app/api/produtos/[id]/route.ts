import { NextRequest, NextResponse } from 'next/server';
import { mockProdutos } from '@/lib/mock-data/produtos';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const produto = mockProdutos.find((p) => p.id === id);

  if (!produto) {
    return NextResponse.json(
      { error: 'Produto não encontrado' },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: produto });
}
