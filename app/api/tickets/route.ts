import { NextRequest, NextResponse } from 'next/server';
import { mockTickets } from '@/lib/mock-data/tickets';

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json({
    data: mockTickets,
    total: mockTickets.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titulo, descricao, clienteId, distribuidoraId, pedidoId, prioridade } = body;

    // Validate input
    if (!titulo || !descricao || !clienteId || !prioridade) {
      return NextResponse.json(
        {
          success: false,
          error: 'Título, descrição, cliente e prioridade são obrigatórios'
        },
        { status: 400 }
      );
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate random success/error (95% success rate)
    const isSuccess = Math.random() > 0.05;

    if (isSuccess) {
      return NextResponse.json({
        success: true,
        message: 'Ticket criado com sucesso!',
        data: {
          id: `ticket-${Date.now()}`,
          titulo,
          descricao,
          clienteId,
          distribuidoraId: distribuidoraId || null,
          pedidoId: pedidoId || null,
          prioridade,
          status: 'open',
          criadoEm: new Date().toISOString(),
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Erro ao criar ticket. Tente novamente.',
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
