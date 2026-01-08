import { NextRequest, NextResponse } from 'next/server';
import { mockPedidos } from '@/lib/mock-data/pedidos';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const pedidos = mockPedidos.filter((p) => p.clienteId === id);

  return NextResponse.json({
    data: pedidos,
    total: pedidos.length,
  });
}
