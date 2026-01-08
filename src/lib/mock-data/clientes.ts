export interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cargo?: string;
}

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  status: 'ativo' | 'inativo';
  dataCadastro: string;
  usuarios?: User[];
}

export const mockClientes: Cliente[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao.silva@empresa.com',
    telefone: '(11) 98765-4321',
    empresa: 'Empresa ABC',
    status: 'ativo',
    dataCadastro: '2024-01-15',
    usuarios: [
      {
        id: '1-1',
        nome: 'João Silva',
        email: 'joao.silva@empresaabc.com',
        telefone: '(11) 98765-4321',
        cargo: 'Diretor',
      },
      {
        id: '1-2',
        nome: 'Paula Mendes',
        email: 'paula.mendes@empresaabc.com',
        telefone: '(11) 98765-4322',
        cargo: 'Gerente de Compras',
      },
    ],
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria.santos@tech.com',
    telefone: '(21) 91234-5678',
    empresa: 'Tech Solutions',
    status: 'ativo',
    dataCadastro: '2024-02-20',
    usuarios: [
      {
        id: '2-1',
        nome: 'Maria Santos',
        email: 'maria.santos@techsolutions.com',
        telefone: '(21) 91234-5678',
        cargo: 'CEO',
      },
      {
        id: '2-2',
        nome: 'Roberto Lima',
        email: 'roberto.lima@techsolutions.com',
        telefone: '(21) 91234-5679',
        cargo: 'CTO',
      },
      {
        id: '2-3',
        nome: 'Fernanda Rocha',
        email: 'fernanda.rocha@techsolutions.com',
        telefone: '(21) 91234-5680',
        cargo: 'Coordenador',
      },
    ],
  },
  {
    id: '3',
    nome: 'Pedro Oliveira',
    email: 'pedro.oliveira@commerce.com',
    telefone: '(31) 99876-5432',
    empresa: 'Commerce Plus',
    status: 'inativo',
    dataCadastro: '2024-03-10',
    usuarios: [
      {
        id: '3-1',
        nome: 'Pedro Oliveira',
        email: 'pedro.oliveira@commerceplus.com',
        telefone: '(31) 99876-5432',
        cargo: 'Proprietário',
      },
    ],
  },
  {
    id: '4',
    nome: 'Ana Costa',
    email: 'ana.costa@digital.com',
    telefone: '(41) 98888-7777',
    empresa: 'Digital First',
    status: 'ativo',
    dataCadastro: '2024-04-05',
    usuarios: [
      {
        id: '4-1',
        nome: 'Ana Costa',
        email: 'ana.costa@digitalfirst.com',
        telefone: '(41) 98888-7777',
        cargo: 'Diretora de Marketing',
      },
      {
        id: '4-2',
        nome: 'Lucas Almeida',
        email: 'lucas.almeida@digitalfirst.com',
        telefone: '(41) 98888-7778',
        cargo: 'Analista',
      },
    ],
  },
  {
    id: '5',
    nome: 'Carlos Ferreira',
    email: 'carlos.ferreira@startup.com',
    telefone: '(51) 97777-6666',
    empresa: 'Startup Inovadora',
    status: 'ativo',
    dataCadastro: '2024-05-12',
    usuarios: [
      {
        id: '5-1',
        nome: 'Carlos Ferreira',
        email: 'carlos.ferreira@startupinovadora.com',
        telefone: '(51) 97777-6666',
        cargo: 'Founder',
      },
    ],
  },
];
