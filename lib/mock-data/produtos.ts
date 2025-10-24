export interface Produto {
  id: string;
  nome: string;
  codigo: string;
  categoria: string;
  preco: number;
  estoque: number;
  status: 'disponivel' | 'indisponivel';
  descricao: string;
}

export const mockProdutos: Produto[] = [
  {
    id: '1',
    nome: 'Produto Premium A',
    codigo: 'PRD-001',
    categoria: 'Eletrônicos',
    preco: 1299.99,
    estoque: 45,
    status: 'disponivel',
    descricao: 'Produto de alta qualidade',
  },
  {
    id: '2',
    nome: 'Produto Standard B',
    codigo: 'PRD-002',
    categoria: 'Acessórios',
    preco: 199.99,
    estoque: 120,
    status: 'disponivel',
    descricao: 'Acessório essencial',
  },
  {
    id: '3',
    nome: 'Produto Especial C',
    codigo: 'PRD-003',
    categoria: 'Eletrônicos',
    preco: 2499.99,
    estoque: 0,
    status: 'indisponivel',
    descricao: 'Edição limitada',
  },
  {
    id: '4',
    nome: 'Produto Basic D',
    codigo: 'PRD-004',
    categoria: 'Utilidades',
    preco: 49.99,
    estoque: 300,
    status: 'disponivel',
    descricao: 'Produto básico do dia a dia',
  },
  {
    id: '5',
    nome: 'Produto Plus E',
    codigo: 'PRD-005',
    categoria: 'Eletrônicos',
    preco: 899.99,
    estoque: 67,
    status: 'disponivel',
    descricao: 'Tecnologia avançada',
  },
  {
    id: '6',
    nome: 'Produto Smart F',
    codigo: 'PRD-006',
    categoria: 'Smart Home',
    preco: 599.99,
    estoque: 89,
    status: 'disponivel',
    descricao: 'Automação residencial',
  },
];
