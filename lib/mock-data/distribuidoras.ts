export interface Distribuidora {
  id: string;
  nome: string;
  cnpj: string;
  cidade: string;
  estado: string;
  responsavel: string;
  email: string;
  status: 'ativo' | 'inativo';
  lastSync?: string;
}

export const mockDistribuidoras: Distribuidora[] = [
  {
    id: '1',
    nome: 'Distribuidora Nacional S.A.',
    cnpj: '12.345.678/0001-90',
    cidade: 'São Paulo',
    estado: 'SP',
    responsavel: 'Roberto Almeida',
    email: 'contato@nacional.com.br',
    status: 'ativo',
    lastSync: '2024-10-29T08:30:00',
  },
  {
    id: '2',
    nome: 'Sul Distribuidora Ltda',
    cnpj: '98.765.432/0001-10',
    cidade: 'Porto Alegre',
    estado: 'RS',
    responsavel: 'Juliana Souza',
    email: 'contato@suldist.com.br',
    status: 'ativo',
    lastSync: '2024-10-28T14:20:00',
  },
  {
    id: '3',
    nome: 'Nordeste Comércio e Distribuição',
    cnpj: '11.222.333/0001-44',
    cidade: 'Salvador',
    estado: 'BA',
    responsavel: 'Fernando Lima',
    email: 'contato@nordeste.com.br',
    status: 'ativo',
    lastSync: '2024-10-27T10:15:00',
  },
  {
    id: '4',
    nome: 'Centro-Oeste Distribuidora',
    cnpj: '44.555.666/0001-77',
    cidade: 'Brasília',
    estado: 'DF',
    responsavel: 'Camila Rocha',
    email: 'contato@centrooeste.com.br',
    status: 'inativo',
    lastSync: '2024-10-20T16:45:00',
  },
  {
    id: '5',
    nome: 'Norte Logística e Distribuição',
    cnpj: '77.888.999/0001-00',
    cidade: 'Manaus',
    estado: 'AM',
    responsavel: 'Ricardo Martins',
    email: 'contato@nortelogistica.com.br',
    status: 'ativo',
    lastSync: '2024-10-29T09:00:00',
  },
];
