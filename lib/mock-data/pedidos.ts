export interface Pedido {
  id: string;
  numero: string;
  clienteId: string;
  distribuidoraId: string;
  data: string;
  status: 'pendente' | 'em_processamento' | 'enviado' | 'entregue' | 'cancelado';
  total: number;
  itens: PedidoItem[];
}

export interface PedidoItem {
  id: string;
  produtoId: string;
  produtoNome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export const mockPedidos: Pedido[] = [
  {
    id: '1',
    numero: 'PED-2024-001',
    clienteId: '1',
    distribuidoraId: '1',
    data: '2024-01-15',
    status: 'entregue',
    total: 2599.98,
    itens: [
      {
        id: '1',
        produtoId: '1',
        produtoNome: 'Produto Premium A',
        quantidade: 2,
        precoUnitario: 1299.99,
        subtotal: 2599.98,
      },
    ],
  },
  {
    id: '2',
    numero: 'PED-2024-002',
    clienteId: '1',
    distribuidoraId: '2',
    data: '2024-02-10',
    status: 'entregue',
    total: 399.98,
    itens: [
      {
        id: '2',
        produtoId: '2',
        produtoNome: 'Produto Standard B',
        quantidade: 2,
        precoUnitario: 199.99,
        subtotal: 399.98,
      },
    ],
  },
  {
    id: '3',
    numero: 'PED-2024-003',
    clienteId: '1',
    distribuidoraId: '1',
    data: '2024-03-05',
    status: 'enviado',
    total: 1799.97,
    itens: [
      {
        id: '3',
        produtoId: '5',
        produtoNome: 'Produto Plus E',
        quantidade: 2,
        precoUnitario: 899.99,
        subtotal: 1799.98,
      },
    ],
  },
  {
    id: '4',
    numero: 'PED-2024-004',
    clienteId: '1',
    distribuidoraId: '3',
    data: '2024-04-12',
    status: 'em_processamento',
    total: 149.97,
    itens: [
      {
        id: '4',
        produtoId: '4',
        produtoNome: 'Produto Basic D',
        quantidade: 3,
        precoUnitario: 49.99,
        subtotal: 149.97,
      },
    ],
  },
  {
    id: '5',
    numero: 'PED-2024-005',
    clienteId: '1',
    distribuidoraId: '1',
    data: '2024-05-20',
    status: 'pendente',
    total: 3899.95,
    itens: [
      {
        id: '5',
        produtoId: '1',
        produtoNome: 'Produto Premium A',
        quantidade: 3,
        precoUnitario: 1299.99,
        subtotal: 3899.97,
      },
    ],
  },
  {
    id: '6',
    numero: 'PED-2024-006',
    clienteId: '1',
    distribuidoraId: '2',
    data: '2024-06-08',
    status: 'entregue',
    total: 599.99,
    itens: [
      {
        id: '6',
        produtoId: '6',
        produtoNome: 'Produto Smart F',
        quantidade: 1,
        precoUnitario: 599.99,
        subtotal: 599.99,
      },
    ],
  },
  {
    id: '7',
    numero: 'PED-2024-007',
    clienteId: '1',
    distribuidoraId: '1',
    data: '2024-07-15',
    status: 'entregue',
    total: 999.96,
    itens: [
      {
        id: '7',
        produtoId: '2',
        produtoNome: 'Produto Standard B',
        quantidade: 5,
        precoUnitario: 199.99,
        subtotal: 999.95,
      },
    ],
  },
  {
    id: '8',
    numero: 'PED-2024-008',
    clienteId: '1',
    distribuidoraId: '3',
    data: '2024-08-22',
    status: 'entregue',
    total: 2699.97,
    itens: [
      {
        id: '8',
        produtoId: '5',
        produtoNome: 'Produto Plus E',
        quantidade: 3,
        precoUnitario: 899.99,
        subtotal: 2699.97,
      },
    ],
  },
  {
    id: '9',
    numero: 'PED-2024-009',
    clienteId: '1',
    distribuidoraId: '1',
    data: '2024-09-10',
    status: 'cancelado',
    total: 2499.99,
    itens: [
      {
        id: '9',
        produtoId: '3',
        produtoNome: 'Produto Especial C',
        quantidade: 1,
        precoUnitario: 2499.99,
        subtotal: 2499.99,
      },
    ],
  },
  {
    id: '10',
    numero: 'PED-2024-010',
    clienteId: '1',
    distribuidoraId: '2',
    data: '2024-10-05',
    status: 'entregue',
    total: 1799.98,
    itens: [
      {
        id: '10',
        produtoId: '6',
        produtoNome: 'Produto Smart F',
        quantidade: 3,
        precoUnitario: 599.99,
        subtotal: 1799.97,
      },
    ],
  },
  {
    id: '11',
    numero: 'PED-2024-011',
    clienteId: '1',
    distribuidoraId: '1',
    data: '2024-10-12',
    status: 'enviado',
    total: 1299.99,
    itens: [
      {
        id: '11',
        produtoId: '1',
        produtoNome: 'Produto Premium A',
        quantidade: 1,
        precoUnitario: 1299.99,
        subtotal: 1299.99,
      },
    ],
  },
  {
    id: '12',
    numero: 'PED-2024-012',
    clienteId: '1',
    distribuidoraId: '2',
    data: '2024-10-15',
    status: 'em_processamento',
    total: 449.97,
    itens: [
      {
        id: '12',
        produtoId: '4',
        produtoNome: 'Produto Basic D',
        quantidade: 9,
        precoUnitario: 49.99,
        subtotal: 449.91,
      },
    ],
  },
  {
    id: '13',
    numero: 'PED-2024-013',
    clienteId: '1',
    distribuidoraId: '3',
    data: '2024-10-18',
    status: 'pendente',
    total: 899.99,
    itens: [
      {
        id: '13',
        produtoId: '5',
        produtoNome: 'Produto Plus E',
        quantidade: 1,
        precoUnitario: 899.99,
        subtotal: 899.99,
      },
    ],
  },
  {
    id: '14',
    numero: 'PED-2024-014',
    clienteId: '1',
    distribuidoraId: '1',
    data: '2024-10-20',
    status: 'pendente',
    total: 1199.97,
    itens: [
      {
        id: '14',
        produtoId: '6',
        produtoNome: 'Produto Smart F',
        quantidade: 2,
        precoUnitario: 599.99,
        subtotal: 1199.98,
      },
    ],
  },
  {
    id: '15',
    numero: 'PED-2024-015',
    clienteId: '1',
    distribuidoraId: '2',
    data: '2024-10-21',
    status: 'entregue',
    total: 5199.96,
    itens: [
      {
        id: '15',
        produtoId: '1',
        produtoNome: 'Produto Premium A',
        quantidade: 4,
        precoUnitario: 1299.99,
        subtotal: 5199.96,
      },
    ],
  },
  {
    id: '16',
    numero: 'PED-2024-016',
    clienteId: '1',
    distribuidoraId: '1',
    data: '2024-10-22',
    status: 'entregue',
    total: 799.96,
    itens: [
      {
        id: '16',
        produtoId: '2',
        produtoNome: 'Produto Standard B',
        quantidade: 4,
        precoUnitario: 199.99,
        subtotal: 799.96,
      },
    ],
  },
  {
    id: '17',
    numero: 'PED-2024-017',
    clienteId: '1',
    distribuidoraId: '3',
    data: '2024-10-23',
    status: 'em_processamento',
    total: 3599.96,
    itens: [
      {
        id: '17',
        produtoId: '5',
        produtoNome: 'Produto Plus E',
        quantidade: 4,
        precoUnitario: 899.99,
        subtotal: 3599.96,
      },
    ],
  },
  {
    id: '18',
    numero: 'PED-2024-018',
    clienteId: '1',
    distribuidoraId: '1',
    data: '2024-10-24',
    status: 'enviado',
    total: 249.95,
    itens: [
      {
        id: '18',
        produtoId: '4',
        produtoNome: 'Produto Basic D',
        quantidade: 5,
        precoUnitario: 49.99,
        subtotal: 249.95,
      },
    ],
  },
  {
    id: '19',
    numero: 'PED-2024-019',
    clienteId: '1',
    distribuidoraId: '2',
    data: '2024-10-25',
    status: 'pendente',
    total: 2999.97,
    itens: [
      {
        id: '19',
        produtoId: '6',
        produtoNome: 'Produto Smart F',
        quantidade: 5,
        precoUnitario: 599.99,
        subtotal: 2999.95,
      },
    ],
  },
  {
    id: '20',
    numero: 'PED-2024-020',
    clienteId: '1',
    distribuidoraId: '1',
    data: '2024-10-26',
    status: 'pendente',
    total: 6499.95,
    itens: [
      {
        id: '20',
        produtoId: '1',
        produtoNome: 'Produto Premium A',
        quantidade: 5,
        precoUnitario: 1299.99,
        subtotal: 6499.95,
      },
    ],
  },
  // Other clients' orders
  {
    id: '21',
    numero: 'PED-2024-021',
    clienteId: '2',
    distribuidoraId: '2',
    data: '2024-10-01',
    status: 'entregue',
    total: 899.99,
    itens: [
      {
        id: '21',
        produtoId: '5',
        produtoNome: 'Produto Plus E',
        quantidade: 1,
        precoUnitario: 899.99,
        subtotal: 899.99,
      },
    ],
  },
];
