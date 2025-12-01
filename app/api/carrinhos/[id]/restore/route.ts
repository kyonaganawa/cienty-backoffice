import { NextRequest, NextResponse } from 'next/server';
import { mockCarrinhos } from '@/lib/mock-data/carrinhos';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const carrinho = mockCarrinhos.find((c) => c.id === id);

  if (!carrinho) {
    return NextResponse.json(
      { error: 'Carrinho não encontrado' },
      { status: 404 }
    );
  }

  // Find all carts from the same client and user and set them to arquivado
  mockCarrinhos.forEach((c) => {
    if (c.clienteId === carrinho.clienteId && c.userId === carrinho.userId) {
      c.status = 'arquivado';
    }
  });

  // Set the selected cart as active
  carrinho.status = 'ativo';
  carrinho.dataUltimaModificacao = new Date().toISOString();

  return NextResponse.json({
    data: carrinho,
    message: 'Carrinho restaurado com sucesso',
  });
}
