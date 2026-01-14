export interface AdminUser {
  id: string;
  nome: string;
  email: string;
  cargo: string; // Role/position
  ativo: boolean;
}

export const mockAdminUsers: AdminUser[] = [
  {
    id: 'admin-1',
    nome: 'Admin User',
    email: 'admin@backoffice.com',
    cargo: 'Administrador',
    ativo: true,
  },
  {
    id: 'admin-2',
    nome: 'Maria Silva',
    email: 'maria.silva@backoffice.com',
    cargo: 'Suporte Técnico',
    ativo: true,
  },
  {
    id: 'admin-3',
    nome: 'João Santos',
    email: 'joao.santos@backoffice.com',
    cargo: 'Gerente de Logística',
    ativo: true,
  },
  {
    id: 'admin-4',
    nome: 'Ana Costa',
    email: 'ana.costa@backoffice.com',
    cargo: 'Financeiro',
    ativo: true,
  },
  {
    id: 'admin-5',
    nome: 'Carlos Ferreira',
    email: 'carlos.ferreira@backoffice.com',
    cargo: 'Suporte Técnico',
    ativo: true,
  },
  {
    id: 'admin-6',
    nome: 'Beatriz Oliveira',
    email: 'beatriz.oliveira@backoffice.com',
    cargo: 'Atendimento ao Cliente',
    ativo: true,
  },
  {
    id: 'admin-7',
    nome: 'Ricardo Lima',
    email: 'ricardo.lima@backoffice.com',
    cargo: 'Gerente de Operações',
    ativo: true,
  },
  {
    id: 'admin-8',
    nome: 'Fernanda Souza',
    email: 'fernanda.souza@backoffice.com',
    cargo: 'Analista de Suporte',
    ativo: false, // Inactive user
  },
];
