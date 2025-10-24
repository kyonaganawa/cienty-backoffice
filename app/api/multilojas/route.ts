import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clienteId, lojaIds } = body;

    // Validate input
    if (!clienteId || !lojaIds || !Array.isArray(lojaIds) || lojaIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cliente e pelo menos uma loja devem ser selecionados'
        },
        { status: 400 }
      );
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate random success/error (90% success rate)
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      return NextResponse.json({
        success: true,
        message: `Cliente vinculado com sucesso a ${lojaIds.length} ${lojaIds.length === 1 ? 'loja' : 'lojas'}`,
        data: {
          clienteId,
          lojaIds,
          vinculadoEm: new Date().toISOString(),
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Erro ao processar vinculação. Tente novamente.',
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
