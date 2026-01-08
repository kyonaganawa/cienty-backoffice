import { NextRequest, NextResponse } from 'next/server';
import { mockComunicacoes, Comunicacao } from '@/lib/mock-data/comunicacoes';

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json({
    data: mockComunicacoes,
    total: mockComunicacoes.length,
  });
}

export async function POST(request: NextRequest) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.titulo || !body.texto || !body.tipo || !body.dataInicio || !body.dataFim) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Validate frequency for popup type
    if (body.tipo === 'popup' && !body.frequenciaHoras) {
      return NextResponse.json(
        { error: 'Frequência de exibição é obrigatória para pop-ups' },
        { status: 400 }
      );
    }

    // Create new communication
    const novaComunicacao: Comunicacao = {
      id: (mockComunicacoes.length + 1).toString(),
      titulo: body.titulo,
      texto: body.texto,
      tipo: body.tipo,
      dataInicio: body.dataInicio,
      dataFim: body.dataFim,
      imagem: body.imagem || undefined,
      linkAcao: body.linkAcao || undefined,
      frequenciaHoras: body.tipo === 'popup' && body.frequenciaHoras
        ? parseInt(body.frequenciaHoras)
        : undefined,
      status: body.status || 'ativo',
      prioridade: body.prioridade || 'media',
      alvo: body.alvo || 'todos',
      visualizacoes: 0,
      cliques: 0,
      dataCriacao: new Date().toISOString(),
      criadoPor: 'admin@cienty.com', // In a real app, this would come from the authenticated user
    };

    // In a real application, this would save to a database
    mockComunicacoes.push(novaComunicacao);

    return NextResponse.json({
      data: novaComunicacao,
      message: 'Comunicação criada com sucesso',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar comunicação' },
      { status: 500 }
    );
  }
}
