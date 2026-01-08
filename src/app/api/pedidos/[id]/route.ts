import { NextRequest, NextResponse } from 'next/server';
import { mockPedidos } from '@/lib/mock-data/pedidos';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const pedido = mockPedidos.find((p) => p.id === id);

  if (!pedido) {
    return NextResponse.json(
      { error: 'Pedido não encontrado' },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: pedido });
}
