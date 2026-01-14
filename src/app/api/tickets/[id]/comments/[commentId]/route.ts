import { NextRequest, NextResponse } from 'next/server';
import { mockTickets } from '@/lib/mock-data/tickets';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { id, commentId } = await params;

    // Find ticket
    const ticketIndex = mockTickets.findIndex((t) => t.id === id);

    if (ticketIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Ticket não encontrado' },
        { status: 404 }
      );
    }

    const ticket = mockTickets[ticketIndex];

    // Find comment
    const commentIndex = ticket.comments?.findIndex((c) => c.id === commentId);

    if (commentIndex === undefined || commentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Comentário não encontrado' },
        { status: 404 }
      );
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Remove comment
    mockTickets[ticketIndex].comments.splice(commentIndex, 1);

    // Update ticket's last update date
    mockTickets[ticketIndex].dataAtualizacao = new Date().toISOString().split('T')[0];

    return NextResponse.json({
      success: true,
      message: 'Comentário excluído com sucesso!',
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
