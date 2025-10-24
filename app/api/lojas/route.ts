import { NextResponse } from 'next/server';
import { mockLojas } from '@/lib/mock-data/lojas';

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Only return active stores
  const lojasAtivas = mockLojas.filter((loja) => loja.status === 'ativo');

  return NextResponse.json({
    data: lojasAtivas,
    total: lojasAtivas.length,
  });
}
