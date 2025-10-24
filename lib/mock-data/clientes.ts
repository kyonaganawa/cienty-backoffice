export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  status: 'ativo' | 'inativo';
  dataCadastro: string;
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
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria.santos@tech.com',
    telefone: '(21) 91234-5678',
    empresa: 'Tech Solutions',
    status: 'ativo',
    dataCadastro: '2024-02-20',
  },
  {
    id: '3',
    nome: 'Pedro Oliveira',
    email: 'pedro.oliveira@commerce.com',
    telefone: '(31) 99876-5432',
    empresa: 'Commerce Plus',
    status: 'inativo',
    dataCadastro: '2024-03-10',
  },
  {
    id: '4',
    nome: 'Ana Costa',
    email: 'ana.costa@digital.com',
    telefone: '(41) 98888-7777',
    empresa: 'Digital First',
    status: 'ativo',
    dataCadastro: '2024-04-05',
  },
  {
    id: '5',
    nome: 'Carlos Ferreira',
    email: 'carlos.ferreira@startup.com',
    telefone: '(51) 97777-6666',
    empresa: 'Startup Inovadora',
    status: 'ativo',
    dataCadastro: '2024-05-12',
  },
];
