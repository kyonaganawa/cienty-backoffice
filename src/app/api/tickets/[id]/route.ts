import { NextRequest, NextResponse } from 'next/server';
import { mockTickets } from '@/lib/mock-data/tickets';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const ticket = mockTickets.find((t) => t.id === id);

  if (!ticket) {
    return NextResponse.json(
      { error: 'Ticket não encontrado' },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: ticket });
}
