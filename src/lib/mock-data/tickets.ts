export interface TicketTag {
  id: string;
  nome: string;
  cor: string; // Tailwind color class (e.g., 'bg-blue-100 text-blue-800')
}

export interface TicketOwner {
  id: string;
  nome: string;
  email: string;
}

export interface TicketCreator {
  id: string;
  nome: string;
  email: string;
}

export interface TicketAttachment {
  id: string;
  filename: string;
  url: string; // S3 URL
  type: 'image' | 'pdf' | 'video' | 'document';
  mimeType: string;
  size: number; // Size in bytes
  uploadedAt: string;
  uploadedBy: {
    id: string;
    nome: string;
    email: string;
  };
}

export const ALLOWED_FILE_TYPES: Record<TicketAttachment['type'], string[]> = {
  image: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
  pdf: ['application/pdf'],
  video: ['video/mp4', 'video/quicktime', 'video/webm'],
  document: [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
  ],
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_ATTACHMENTS = 10;

export interface TicketComment {
  id: string;
  ticketId: string;
  content: string;
  author: {
    id: string;
    nome: string;
    email: string;
  };
  createdAt: string;
}

export interface Ticket {
  id: string;
  titulo: string;
  descricao: string;
  clienteId: string;
  clienteNome: string;
  criador: TicketCreator; // Admin user who created the ticket
  owners: TicketOwner[]; // Admin users assigned to the ticket
  distribuidoraId?: string;
  distribuidoraNome?: string;
  pedidoId?: string;
  pedidoNumero?: string;
  status: 'open' | 'assigned' | 'resolved' | 'closed';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  tags: TicketTag[];
  attachments: TicketAttachment[];
  comments: TicketComment[];
  dataCriacao: string;
  dataAtualizacao: string;
}

// Available tag colors for new tags
export const tagColors = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-yellow-100 text-yellow-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
  'bg-orange-100 text-orange-800',
  'bg-teal-100 text-teal-800',
];

// Mock available tags (these persist and can be reused)
export const mockTags: TicketTag[] = [
  { id: 'tag-1', nome: 'Entrega', cor: 'bg-blue-100 text-blue-800' },
  { id: 'tag-2', nome: 'Financeiro', cor: 'bg-green-100 text-green-800' },
  { id: 'tag-3', nome: 'Suporte Técnico', cor: 'bg-purple-100 text-purple-800' },
  { id: 'tag-4', nome: 'Cadastro', cor: 'bg-yellow-100 text-yellow-800' },
  { id: 'tag-5', nome: 'Produto', cor: 'bg-pink-100 text-pink-800' },
  { id: 'tag-6', nome: 'Reembolso', cor: 'bg-orange-100 text-orange-800' },
  { id: 'tag-7', nome: 'Urgente', cor: 'bg-red-100 text-red-800' },
  { id: 'tag-8', nome: 'Garantia', cor: 'bg-indigo-100 text-indigo-800' },
];

export const mockTickets: Ticket[] = [
  // Open tickets (this week: Jan 8-14, 2026)
  {
    id: '1',
    titulo: 'Problema com entrega do pedido',
    descricao: 'Cliente reportou que o pedido PED-2026-003 não foi entregue no prazo. Necessário verificar com a distribuidora o status da entrega e informar previsão atualizada.',
    clienteId: '1',
    clienteNome: 'João Silva',
    criador: { id: 'admin-1', nome: 'Admin User', email: 'admin@backoffice.com' },
    owners: [],
    distribuidoraId: '1',
    distribuidoraNome: 'Distribuidora Nacional S.A.',
    pedidoId: '3',
    pedidoNumero: 'PED-2026-003',
    status: 'open',
    prioridade: 'alta',
    tags: [
      { id: 'tag-1', nome: 'Entrega', cor: 'bg-blue-100 text-blue-800' },
      { id: 'tag-7', nome: 'Urgente', cor: 'bg-red-100 text-red-800' },
    ],
    attachments: [],
    comments: [],
    dataCriacao: '2026-01-14',
    dataAtualizacao: '2026-01-14',
  },
  {
    id: '2',
    titulo: 'Solicitação de alteração de dados cadastrais',
    descricao: 'Cliente solicitou atualização do endereço de entrega e telefone de contato. Novos dados: Rua das Flores, 123 - São Paulo, SP. Tel: (11) 91234-5678',
    clienteId: '2',
    clienteNome: 'Maria Santos',
    criador: { id: 'admin-6', nome: 'Beatriz Oliveira', email: 'beatriz.oliveira@backoffice.com' },
    owners: [],
    status: 'open',
    prioridade: 'media',
    tags: [
      { id: 'tag-4', nome: 'Cadastro', cor: 'bg-yellow-100 text-yellow-800' },
    ],
    attachments: [],
    comments: [],
    dataCriacao: '2026-01-13',
    dataAtualizacao: '2026-01-13',
  },
  {
    id: '3',
    titulo: 'Dúvida sobre produto',
    descricao: 'Cliente tem dúvidas sobre as especificações técnicas do Produto Premium A e compatibilidade com sistemas existentes.',
    clienteId: '1',
    clienteNome: 'João Silva',
    criador: { id: 'admin-1', nome: 'Admin User', email: 'admin@backoffice.com' },
    owners: [],
    status: 'open',
    prioridade: 'baixa',
    tags: [
      { id: 'tag-5', nome: 'Produto', cor: 'bg-pink-100 text-pink-800' },
      { id: 'tag-3', nome: 'Suporte Técnico', cor: 'bg-purple-100 text-purple-800' },
    ],
    attachments: [],
    comments: [],
    dataCriacao: '2026-01-12',
    dataAtualizacao: '2026-01-12',
  },
  {
    id: '4',
    titulo: 'Erro no valor do pedido',
    descricao: 'Cliente reportou divergência no valor total do pedido PED-2026-015. Verificar se os descontos foram aplicados corretamente.',
    clienteId: '1',
    clienteNome: 'João Silva',
    criador: { id: 'admin-1', nome: 'Admin User', email: 'admin@backoffice.com' },
    owners: [],
    pedidoId: '15',
    pedidoNumero: 'PED-2026-015',
    status: 'open',
    prioridade: 'urgente',
    tags: [
      { id: 'tag-2', nome: 'Financeiro', cor: 'bg-green-100 text-green-800' },
      { id: 'tag-7', nome: 'Urgente', cor: 'bg-red-100 text-red-800' },
    ],
    attachments: [],
    comments: [],
    dataCriacao: '2026-01-10',
    dataAtualizacao: '2026-01-10',
  },

  // Assigned tickets (last 2 weeks: Jan 1-13, 2026)
  {
    id: '5',
    titulo: 'Produto com defeito',
    descricao: 'Cliente reportou que o Produto Smart F apresentou defeito após 2 dias de uso. Produto coberto pela garantia. Necessário agendar troca.',
    clienteId: '1',
    clienteNome: 'João Silva',
    criador: { id: 'admin-1', nome: 'Admin User', email: 'admin@backoffice.com' },
    owners: [
      { id: 'admin-2', nome: 'Maria Silva', email: 'maria.silva@backoffice.com' },
    ],
    pedidoId: '6',
    pedidoNumero: 'PED-2026-006',
    status: 'assigned',
    prioridade: 'alta',
    tags: [
      { id: 'tag-5', nome: 'Produto', cor: 'bg-pink-100 text-pink-800' },
      { id: 'tag-8', nome: 'Garantia', cor: 'bg-indigo-100 text-indigo-800' },
    ],
    attachments: [],
    comments: [],
    dataCriacao: '2026-01-11',
    dataAtualizacao: '2026-01-12',
  },
  {
    id: '6',
    titulo: 'Atraso na distribuição',
    descricao: 'Distribuidora Sul Distribuidora Ltda está com atraso de 5 dias em pedidos. Verificar motivo e estabelecer novo prazo.',
    clienteId: '2',
    clienteNome: 'Maria Santos',
    criador: { id: 'admin-6', nome: 'Beatriz Oliveira', email: 'beatriz.oliveira@backoffice.com' },
    owners: [
      { id: 'admin-3', nome: 'João Santos', email: 'joao.santos@backoffice.com' },
    ],
    distribuidoraId: '2',
    distribuidoraNome: 'Sul Distribuidora Ltda',
    status: 'assigned',
    prioridade: 'alta',
    tags: [
      { id: 'tag-1', nome: 'Entrega', cor: 'bg-blue-100 text-blue-800' },
    ],
    attachments: [],
    comments: [],
    dataCriacao: '2026-01-09',
    dataAtualizacao: '2026-01-10',
  },
  {
    id: '7',
    titulo: 'Solicitação de reembolso',
    descricao: 'Cliente solicitou reembolso do pedido PED-2026-009 que foi cancelado. Valor total: R$ 2.499,99',
    clienteId: '1',
    clienteNome: 'João Silva',
    criador: { id: 'admin-1', nome: 'Admin User', email: 'admin@backoffice.com' },
    owners: [
      { id: 'admin-4', nome: 'Ana Costa', email: 'ana.costa@backoffice.com' },
    ],
    pedidoId: '9',
    pedidoNumero: 'PED-2026-009',
    status: 'assigned',
    prioridade: 'media',
    tags: [
      { id: 'tag-6', nome: 'Reembolso', cor: 'bg-orange-100 text-orange-800' },
      { id: 'tag-2', nome: 'Financeiro', cor: 'bg-green-100 text-green-800' },
    ],
    attachments: [],
    comments: [],
    dataCriacao: '2026-01-08',
    dataAtualizacao: '2026-01-09',
  },
  {
    id: '8',
    titulo: 'Integração com sistema do cliente',
    descricao: 'Cliente necessita de suporte para integração da API com sistema interno. Requer documentação técnica e exemplos de código.',
    clienteId: '3',
    clienteNome: 'Pedro Oliveira',
    criador: { id: 'admin-1', nome: 'Admin User', email: 'admin@backoffice.com' },
    owners: [
      { id: 'admin-2', nome: 'Maria Silva', email: 'maria.silva@backoffice.com' },
      { id: 'admin-5', nome: 'Carlos Ferreira', email: 'carlos.ferreira@backoffice.com' },
    ],
    status: 'assigned',
    prioridade: 'media',
    tags: [
      { id: 'tag-3', nome: 'Suporte Técnico', cor: 'bg-purple-100 text-purple-800' },
    ],
    attachments: [],
    comments: [],
    dataCriacao: '2026-01-05',
    dataAtualizacao: '2026-01-07',
  },

  // Resolved tickets (last month: Dec 20 - Jan 10, 2026)
  {
    id: '9',
    titulo: 'Nota fiscal não recebida',
    descricao: 'Cliente não recebeu nota fiscal do pedido PED-2026-001. Nota foi reenviada por email.',
    clienteId: '1',
    clienteNome: 'João Silva',
    criador: { id: 'admin-1', nome: 'Admin User', email: 'admin@backoffice.com' },
    owners: [
      { id: 'admin-4', nome: 'Ana Costa', email: 'ana.costa@backoffice.com' },
    ],
    pedidoId: '1',
    pedidoNumero: 'PED-2026-001',
    status: 'resolved',
    prioridade: 'baixa',
    tags: [
      { id: 'tag-2', nome: 'Financeiro', cor: 'bg-green-100 text-green-800' },
    ],
    attachments: [],
    comments: [],
    dataCriacao: '2026-01-06',
    dataAtualizacao: '2026-01-07',
  },
  {
    id: '10',
    titulo: 'Informações sobre novo produto',
    descricao: 'Cliente solicitou informações sobre lançamento de novos produtos. Catálogo 2026 enviado por email.',
    clienteId: '4',
    clienteNome: 'Ana Costa',
    criador: { id: 'admin-6', nome: 'Beatriz Oliveira', email: 'beatriz.oliveira@backoffice.com' },
    owners: [
      { id: 'admin-2', nome: 'Maria Silva', email: 'maria.silva@backoffice.com' },
    ],
    status: 'resolved',
    prioridade: 'baixa',
    tags: [
      { id: 'tag-5', nome: 'Produto', cor: 'bg-pink-100 text-pink-800' },
    ],
    attachments: [],
    comments: [],
    dataCriacao: '2026-01-03',
    dataAtualizacao: '2026-01-04',
  },
  {
    id: '11',
    titulo: 'Problema no login do portal',
    descricao: 'Cliente reportou erro ao fazer login no portal. Senha resetada e novo acesso enviado.',
    clienteId: '5',
    clienteNome: 'Carlos Ferreira',
    criador: { id: 'admin-1', nome: 'Admin User', email: 'admin@backoffice.com' },
    owners: [
      { id: 'admin-2', nome: 'Maria Silva', email: 'maria.silva@backoffice.com' },
    ],
    status: 'resolved',
    prioridade: 'media',
    tags: [
      { id: 'tag-3', nome: 'Suporte Técnico', cor: 'bg-purple-100 text-purple-800' },
    ],
    attachments: [],
    comments: [],
    dataCriacao: '2025-12-28',
    dataAtualizacao: '2025-12-29',
  },
  {
    id: '12',
    titulo: 'Pedido duplicado por engano',
    descricao: 'Cliente realizou pedido duplicado por engano. Um dos pedidos foi cancelado sem custos.',
    clienteId: '1',
    clienteNome: 'João Silva',
    criador: { id: 'admin-1', nome: 'Admin User', email: 'admin@backoffice.com' },
    owners: [
      { id: 'admin-3', nome: 'João Santos', email: 'joao.santos@backoffice.com' },
    ],
    status: 'resolved',
    prioridade: 'media',
    tags: [],
    attachments: [],
    comments: [],
    dataCriacao: '2025-12-22',
    dataAtualizacao: '2025-12-23',
  },

  // Closed tickets (older: Nov-Dec 2025)
  {
    id: '13',
    titulo: 'Consultoria sobre melhor produto',
    descricao: 'Cliente solicitou consultoria para escolher o melhor produto para sua necessidade. Recomendação feita e pedido realizado.',
    clienteId: '2',
    clienteNome: 'Maria Santos',
    criador: { id: 'admin-6', nome: 'Beatriz Oliveira', email: 'beatriz.oliveira@backoffice.com' },
    owners: [
      { id: 'admin-2', nome: 'Maria Silva', email: 'maria.silva@backoffice.com' },
    ],
    status: 'closed',
    prioridade: 'baixa',
    tags: [
      { id: 'tag-5', nome: 'Produto', cor: 'bg-pink-100 text-pink-800' },
    ],
    attachments: [],
    comments: [],
    dataCriacao: '2025-12-18',
    dataAtualizacao: '2025-12-20',
  },
  {
    id: '14',
    titulo: 'Troca de produto realizada',
    descricao: 'Produto com defeito foi trocado com sucesso. Cliente confirmou recebimento e satisfação.',
    clienteId: '1',
    clienteNome: 'João Silva',
    criador: { id: 'admin-1', nome: 'Admin User', email: 'admin@backoffice.com' },
    owners: [
      { id: 'admin-2', nome: 'Maria Silva', email: 'maria.silva@backoffice.com' },
    ],
    status: 'closed',
    prioridade: 'alta',
    tags: [
      { id: 'tag-5', nome: 'Produto', cor: 'bg-pink-100 text-pink-800' },
      { id: 'tag-8', nome: 'Garantia', cor: 'bg-indigo-100 text-indigo-800' },
    ],
    attachments: [],
    comments: [],
    dataCriacao: '2025-12-10',
    dataAtualizacao: '2025-12-15',
  },
  {
    id: '15',
    titulo: 'Atualização de contrato',
    descricao: 'Cliente solicitou atualização nos termos do contrato. Novo contrato assinado e arquivado.',
    clienteId: '3',
    clienteNome: 'Pedro Oliveira',
    criador: { id: 'admin-1', nome: 'Admin User', email: 'admin@backoffice.com' },
    owners: [
      { id: 'admin-4', nome: 'Ana Costa', email: 'ana.costa@backoffice.com' },
    ],
    status: 'closed',
    prioridade: 'media',
    tags: [
      { id: 'tag-2', nome: 'Financeiro', cor: 'bg-green-100 text-green-800' },
    ],
    attachments: [],
    comments: [],
    dataCriacao: '2025-12-01',
    dataAtualizacao: '2025-12-05',
  },
  {
    id: '16',
    titulo: 'Desconto aplicado incorretamente',
    descricao: 'Desconto foi aplicado incorretamente no pedido. Valor ajustado e nota fiscal corrigida emitida.',
    clienteId: '1',
    clienteNome: 'João Silva',
    criador: { id: 'admin-1', nome: 'Admin User', email: 'admin@backoffice.com' },
    owners: [
      { id: 'admin-4', nome: 'Ana Costa', email: 'ana.costa@backoffice.com' },
    ],
    pedidoId: '2',
    pedidoNumero: 'PED-2025-002',
    status: 'closed',
    prioridade: 'media',
    tags: [
      { id: 'tag-2', nome: 'Financeiro', cor: 'bg-green-100 text-green-800' },
    ],
    attachments: [],
    comments: [],
    dataCriacao: '2025-11-25',
    dataAtualizacao: '2025-11-28',
  },
  {
    id: '17',
    titulo: 'Solicitação de documentos fiscais',
    descricao: 'Cliente solicitou segunda via de documentos fiscais do último trimestre. Documentos enviados por email.',
    clienteId: '4',
    clienteNome: 'Ana Costa',
    criador: { id: 'admin-6', nome: 'Beatriz Oliveira', email: 'beatriz.oliveira@backoffice.com' },
    owners: [
      { id: 'admin-4', nome: 'Ana Costa', email: 'ana.costa@backoffice.com' },
    ],
    status: 'closed',
    prioridade: 'baixa',
    tags: [
      { id: 'tag-2', nome: 'Financeiro', cor: 'bg-green-100 text-green-800' },
    ],
    attachments: [],
    comments: [],
    dataCriacao: '2025-11-15',
    dataAtualizacao: '2025-11-18',
  },
];
