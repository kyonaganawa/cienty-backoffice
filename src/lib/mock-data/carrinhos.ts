export interface ItemCarrinho {
  produtoId: string;
  produtoNome: string;
  produtoCodigo: string;
  quantidade: number;
  precoUnitario: number;
  precoTotal: number;
}

export interface Carrinho {
  id: string;
  clienteId: string;
  clienteNome: string;
  userId: string;
  userNome: string;
  status: 'ativo' | 'arquivado';
  itens: ItemCarrinho[];
  totalItens: number;
  valorTotal: number;
  dataCriacao: string;
  dataUltimaModificacao: string;
}

export const mockCarrinhos: Carrinho[] = [
  {
    id: '1',
    clienteId: '1',
    clienteNome: 'Empresa ABC',
    userId: '1-1',
    userNome: 'João Silva',
    status: 'ativo',
    itens: [
      {
        produtoId: '1',
        produtoNome: 'Produto Premium A',
        produtoCodigo: 'PRD-001',
        quantidade: 2,
        precoUnitario: 1299.99,
        precoTotal: 2599.98,
      },
      {
        produtoId: '2',
        produtoNome: 'Produto Standard B',
        produtoCodigo: 'PRD-002',
        quantidade: 5,
        precoUnitario: 199.99,
        precoTotal: 999.95,
      },
    ],
    totalItens: 7,
    valorTotal: 3599.93,
    dataCriacao: '2025-01-10T10:30:00',
    dataUltimaModificacao: '2025-01-10T15:45:00',
  },
  {
    id: '2',
    clienteId: '1',
    clienteNome: 'Empresa ABC',
    userId: '1-1',
    userNome: 'João Silva',
    status: 'arquivado',
    itens: [
      {
        produtoId: '1',
        produtoNome: 'Produto Premium A',
        produtoCodigo: 'PRD-001',
        quantidade: 1,
        precoUnitario: 1299.99,
        precoTotal: 1299.99,
      },
      {
        produtoId: '4',
        produtoNome: 'Produto Basic D',
        produtoCodigo: 'PRD-004',
        quantidade: 10,
        precoUnitario: 49.99,
        precoTotal: 499.90,
      },
      {
        produtoId: '5',
        produtoNome: 'Produto Essential E',
        produtoCodigo: 'PRD-005',
        quantidade: 3,
        precoUnitario: 799.99,
        precoTotal: 2399.97,
      },
    ],
    totalItens: 14,
    valorTotal: 4199.86,
    dataCriacao: '2025-01-05T14:20:00',
    dataUltimaModificacao: '2025-01-08T11:30:00',
  },
  {
    id: '3',
    clienteId: '1',
    clienteNome: 'Empresa ABC',
    userId: '1-2',
    userNome: 'Paula Mendes',
    status: 'ativo',
    itens: [
      {
        produtoId: '2',
        produtoNome: 'Produto Standard B',
        produtoCodigo: 'PRD-002',
        quantidade: 20,
        precoUnitario: 199.99,
        precoTotal: 3999.80,
      },
    ],
    totalItens: 20,
    valorTotal: 3999.80,
    dataCriacao: '2024-12-28T09:15:00',
    dataUltimaModificacao: '2025-01-02T16:00:00',
  },
  {
    id: '4',
    clienteId: '2',
    clienteNome: 'Tech Solutions',
    userId: '2-1',
    userNome: 'Maria Santos',
    status: 'ativo',
    itens: [
      {
        produtoId: '3',
        produtoNome: 'Produto Especial C',
        produtoCodigo: 'PRD-003',
        quantidade: 1,
        precoUnitario: 2499.99,
        precoTotal: 2499.99,
      },
      {
        produtoId: '1',
        produtoNome: 'Produto Premium A',
        produtoCodigo: 'PRD-001',
        quantidade: 3,
        precoUnitario: 1299.99,
        precoTotal: 3899.97,
      },
    ],
    totalItens: 4,
    valorTotal: 6399.96,
    dataCriacao: '2025-01-12T11:00:00',
    dataUltimaModificacao: '2025-01-12T14:20:00',
  },
  {
    id: '5',
    clienteId: '2',
    clienteNome: 'Tech Solutions',
    userId: '2-1',
    userNome: 'Maria Santos',
    status: 'arquivado',
    itens: [
      {
        produtoId: '5',
        produtoNome: 'Produto Essential E',
        produtoCodigo: 'PRD-005',
        quantidade: 5,
        precoUnitario: 799.99,
        precoTotal: 3999.95,
      },
      {
        produtoId: '4',
        produtoNome: 'Produto Basic D',
        produtoCodigo: 'PRD-004',
        quantidade: 15,
        precoUnitario: 49.99,
        precoTotal: 749.85,
      },
    ],
    totalItens: 20,
    valorTotal: 4749.80,
    dataCriacao: '2025-01-01T10:00:00',
    dataUltimaModificacao: '2025-01-05T09:30:00',
  },
  {
    id: '6',
    clienteId: '2',
    clienteNome: 'Tech Solutions',
    userId: '2-2',
    userNome: 'Roberto Lima',
    status: 'ativo',
    itens: [
      {
        produtoId: '2',
        produtoNome: 'Produto Standard B',
        produtoCodigo: 'PRD-002',
        quantidade: 8,
        precoUnitario: 199.99,
        precoTotal: 1599.92,
      },
    ],
    totalItens: 8,
    valorTotal: 1599.92,
    dataCriacao: '2025-01-11T15:30:00',
    dataUltimaModificacao: '2025-01-11T16:45:00',
  },
  {
    id: '7',
    clienteId: '3',
    clienteNome: 'Commerce Plus',
    userId: '3-1',
    userNome: 'Pedro Oliveira',
    status: 'ativo',
    itens: [
      {
        produtoId: '1',
        produtoNome: 'Produto Premium A',
        produtoCodigo: 'PRD-001',
        quantidade: 5,
        precoUnitario: 1299.99,
        precoTotal: 6499.95,
      },
      {
        produtoId: '3',
        produtoNome: 'Produto Especial C',
        produtoCodigo: 'PRD-003',
        quantidade: 2,
        precoUnitario: 2499.99,
        precoTotal: 4999.98,
      },
    ],
    totalItens: 7,
    valorTotal: 11499.93,
    dataCriacao: '2024-12-20T13:00:00',
    dataUltimaModificacao: '2025-01-03T10:15:00',
  },
  {
    id: '8',
    clienteId: '3',
    clienteNome: 'Commerce Plus',
    userId: '3-1',
    userNome: 'Pedro Oliveira',
    status: 'arquivado',
    itens: [
      {
        produtoId: '4',
        produtoNome: 'Produto Basic D',
        produtoCodigo: 'PRD-004',
        quantidade: 50,
        precoUnitario: 49.99,
        precoTotal: 2499.50,
      },
      {
        produtoId: '2',
        produtoNome: 'Produto Standard B',
        produtoCodigo: 'PRD-002',
        quantidade: 10,
        precoUnitario: 199.99,
        precoTotal: 1999.90,
      },
    ],
    totalItens: 60,
    valorTotal: 4499.40,
    dataCriacao: '2025-01-09T08:45:00',
    dataUltimaModificacao: '2025-01-10T12:00:00',
  },
];
