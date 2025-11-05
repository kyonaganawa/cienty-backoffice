export interface Colecao {
  id: string;
  nome: string;
  descricao?: string;
  produtoIds: string[];
  dataCriacao: string;
  criadoPor: string;
}

export const mockColecoes: Colecao[] = [
  {
    id: '1',
    nome: 'Eletrônicos Premium',
    descricao: 'Coleção exclusiva de produtos eletrônicos de alta qualidade',
    produtoIds: ['1', '3'],
    dataCriacao: '2024-12-01T10:00:00',
    criadoPor: 'admin@cienty.com',
  },
  {
    id: '2',
    nome: 'Kit Escritório',
    descricao: 'Produtos essenciais para o seu escritório',
    produtoIds: ['2', '4', '5'],
    dataCriacao: '2024-12-05T14:30:00',
    criadoPor: 'admin@cienty.com',
  },
  {
    id: '3',
    nome: 'Coleção Verão',
    produtoIds: ['6', '7'],
    dataCriacao: '2024-12-10T09:15:00',
    criadoPor: 'marketing@cienty.com',
  },
  {
    id: '4',
    nome: 'Lançamentos',
    descricao: 'Novidades e lançamentos recentes',
    produtoIds: ['8'],
    dataCriacao: '2024-12-15T16:45:00',
    criadoPor: 'admin@cienty.com',
  },
  {
    id: '5',
    nome: 'Black Friday',
    descricao: 'Produtos com descontos especiais para a Black Friday',
    produtoIds: ['1', '2', '4', '5', '6'],
    dataCriacao: '2024-11-01T08:00:00',
    criadoPor: 'marketing@cienty.com',
  },
  {
    id: '6',
    nome: 'Mais Vendidos',
    descricao: 'Os produtos mais populares entre nossos clientes',
    produtoIds: ['2', '4', '7'],
    dataCriacao: '2024-12-20T11:30:00',
    criadoPor: 'vendas@cienty.com',
  },
  {
    id: '7',
    nome: 'Acessórios Essenciais',
    produtoIds: ['2', '5'],
    dataCriacao: '2024-12-22T15:00:00',
    criadoPor: 'admin@cienty.com',
  },
  {
    id: '8',
    nome: 'Premium Collection',
    descricao: 'Produtos de luxo para clientes exigentes',
    produtoIds: ['1', '3', '8'],
    dataCriacao: '2025-01-02T10:00:00',
    criadoPor: 'admin@cienty.com',
  },
];
