import { NextRequest, NextResponse } from 'next/server';
import { mockTickets, TicketComment } from '@/lib/mock-data/tickets';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const ticket = mockTickets.find((t) => t.id === id);

  if (!ticket) {
    return NextResponse.json(
      { success: false, error: 'Ticket não encontrado' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: ticket.comments || [],
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, author } = body;

    // Validate input
    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Conteúdo do comentário é obrigatório' },
        { status: 400 }
      );
    }

    if (!author || !author.id) {
      return NextResponse.json(
        { success: false, error: 'Autor do comentário é obrigatório' },
        { status: 400 }
      );
    }

    // Find ticket
    const ticketIndex = mockTickets.findIndex((t) => t.id === id);

    if (ticketIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Ticket não encontrado' },
        { status: 404 }
      );
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Create new comment
    const newComment: TicketComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      ticketId: id,
      content: content.trim(),
      author: {
        id: author.id,
        nome: author.nome,
        email: author.email,
      },
      createdAt: new Date().toISOString(),
    };

    // Add comment to ticket
    if (!mockTickets[ticketIndex].comments) {
      mockTickets[ticketIndex].comments = [];
    }
    mockTickets[ticketIndex].comments.push(newComment);

    // Update ticket's last update date
    mockTickets[ticketIndex].dataAtualizacao = new Date().toISOString().split('T')[0];

    return NextResponse.json({
      success: true,
      message: 'Comentário adicionado com sucesso!',
      data: newComment,
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
