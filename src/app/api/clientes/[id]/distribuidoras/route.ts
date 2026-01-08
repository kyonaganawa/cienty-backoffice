import { NextRequest, NextResponse } from 'next/server';
import { mockDistribuidoras } from '@/lib/mock-data/distribuidoras';
import { mockPedidos } from '@/lib/mock-data/pedidos';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Get unique distributor IDs from cliente's orders
  const clientePedidos = mockPedidos.filter((p) => p.clienteId === id);
  const distribuidoraIds = [...new Set(clientePedidos.map((p) => p.distribuidoraId))];

  // Get distributor details
  const distribuidoras = mockDistribuidoras.filter((d) =>
    distribuidoraIds.includes(d.id)
  );

  return NextResponse.json({
    data: distribuidoras,
    total: distribuidoras.length,
  });
}
