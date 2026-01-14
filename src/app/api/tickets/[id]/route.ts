import { NextRequest, NextResponse } from 'next/server';
import { mockTickets, Ticket } from '@/lib/mock-data/tickets';

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Find the ticket
    const ticketIndex = mockTickets.findIndex((t) => t.id === id);

    if (ticketIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Ticket não encontrado' },
        { status: 404 }
      );
    }

    const {
      titulo,
      descricao,
      clienteId,
      clienteNome,
      distribuidoraId,
      distribuidoraNome,
      pedidoId,
      pedidoNumero,
      prioridade,
      status,
      tags,
      owners,
      attachments,
    } = body;

    // Validate required fields
    if (!titulo || !descricao || !clienteId || !prioridade) {
      return NextResponse.json(
        {
          success: false,
          error: 'Título, descrição, cliente e prioridade são obrigatórios',
        },
        { status: 400 }
      );
    }

    // Validate status transition (optional - can be expanded)
    const validStatuses = ['open', 'assigned', 'resolved', 'closed'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status inválido' },
        { status: 400 }
      );
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simulate random success/error (95% success rate)
    const isSuccess = Math.random() > 0.05;

    if (isSuccess) {
      // Update the ticket
      const updatedTicket: Ticket = {
        ...mockTickets[ticketIndex],
        titulo,
        descricao,
        clienteId,
        clienteNome: clienteNome || mockTickets[ticketIndex].clienteNome,
        distribuidoraId: distribuidoraId || undefined,
        distribuidoraNome: distribuidoraNome || undefined,
        pedidoId: pedidoId || undefined,
        pedidoNumero: pedidoNumero || undefined,
        prioridade,
        status: status || mockTickets[ticketIndex].status,
        tags: tags ?? mockTickets[ticketIndex].tags,
        owners: owners ?? mockTickets[ticketIndex].owners,
        attachments: attachments ?? mockTickets[ticketIndex].attachments,
        dataAtualizacao: new Date().toISOString().split('T')[0],
      };

      // Update in mock array (in real app, this would be a database update)
      mockTickets[ticketIndex] = updatedTicket;

      return NextResponse.json({
        success: true,
        message: 'Ticket atualizado com sucesso!',
        data: updatedTicket,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Erro ao atualizar ticket. Tente novamente.',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    );
  }
}
