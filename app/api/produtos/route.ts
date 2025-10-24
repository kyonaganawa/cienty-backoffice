import { NextResponse } from 'next/server';
import { mockProdutos } from '@/lib/mock-data/produtos';

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json({
    data: mockProdutos,
    total: mockProdutos.length,
  });
}
