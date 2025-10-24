import { NextResponse } from 'next/server';
import { mockDistribuidoras } from '@/lib/mock-data/distribuidoras';

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json({
    data: mockDistribuidoras,
    total: mockDistribuidoras.length,
  });
}
