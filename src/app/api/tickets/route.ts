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
      tags,
      criador,
      owners,
      attachments,
    } = body;

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

    if (!criador || !criador.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Criador do ticket é obrigatório'
        },
        { status: 400 }
      );
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate random success/error (95% success rate)
    const isSuccess = Math.random() > 0.05;

    if (isSuccess) {
      const now = new Date().toISOString().split('T')[0];
      return NextResponse.json({
        success: true,
        message: 'Ticket criado com sucesso!',
        data: {
          id: `ticket-${Date.now()}`,
          titulo,
          descricao,
          clienteId,
          clienteNome: clienteNome || '',
          distribuidoraId: distribuidoraId || undefined,
          distribuidoraNome: distribuidoraNome || undefined,
          pedidoId: pedidoId || undefined,
          pedidoNumero: pedidoNumero || undefined,
          prioridade,
          tags: tags || [],
          attachments: attachments || [],
          criador,
          owners: owners || [],
          status: 'open',
          dataCriacao: now,
          dataAtualizacao: now,
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
