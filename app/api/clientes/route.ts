import { NextResponse } from 'next/server';
import { mockClientes } from '@/lib/mock-data/clientes';

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json({
    data: mockClientes,
    total: mockClientes.length,
  });
}
