import { NextRequest, NextResponse } from 'next/server';
import { mockColecoes, Colecao } from '@/lib/mock-data/colecoes';

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json({
    data: mockColecoes,
    total: mockColecoes.length,
  });
}

export async function POST(request: NextRequest) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.nome || !body.produtoIds || body.produtoIds.length === 0) {
      return NextResponse.json(
        { error: 'Nome e produtos são obrigatórios' },
        { status: 400 }
      );
    }

    // Create new collection
    const novaColecao: Colecao = {
      id: (mockColecoes.length + 1).toString(),
      nome: body.nome,
      descricao: body.descricao || undefined,
      produtoIds: body.produtoIds,
      dataCriacao: new Date().toISOString(),
      criadoPor: 'admin@cienty.com', // In a real app, this would come from the authenticated user
    };

    // In a real application, this would save to a database
    mockColecoes.push(novaColecao);

    return NextResponse.json({
      data: novaColecao,
      message: 'Coleção criada com sucesso',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar coleção' },
      { status: 500 }
    );
  }
}
