import { NextResponse } from 'next/server';
import { mockPedidos } from '@/lib/mock-data/pedidos';

// Get all pedidos
export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json({
    data: mockPedidos,
    total: mockPedidos.length,
  });
}
