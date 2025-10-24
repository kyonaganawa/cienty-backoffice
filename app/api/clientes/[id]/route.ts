import { NextRequest, NextResponse } from 'next/server';
import { mockClientes } from '@/lib/mock-data/clientes';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const cliente = mockClientes.find((c) => c.id === id);

  if (!cliente) {
    return NextResponse.json(
      { error: 'Cliente não encontrado' },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: cliente });
}
