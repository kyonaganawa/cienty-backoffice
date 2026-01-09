/**
 * Format price in Brazilian Real currency
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

/**
 * Get color classes for order status badges
 */
export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pendente: 'bg-yellow-100 text-yellow-800',
    em_processamento: 'bg-blue-100 text-blue-800',
    enviado: 'bg-purple-100 text-purple-800',
    entregue: 'bg-green-100 text-green-800',
    cancelado: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Get formatted label for order status
 */
export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pendente: 'Pendente',
    em_processamento: 'Em Processamento',
    enviado: 'Enviado',
    entregue: 'Entregue',
    cancelado: 'Cancelado',
  };
  return labels[status] || status;
}

/**
 * Get color classes for ticket status badges
 */
export function getTicketStatusColor(status: string): string {
  const colors: Record<string, string> = {
    aberto: 'bg-blue-100 text-blue-800',
    'em-andamento': 'bg-yellow-100 text-yellow-800',
    aguardando: 'bg-purple-100 text-purple-800',
    resolvido: 'bg-green-100 text-green-800',
    fechado: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Get formatted label for ticket status
 */
export function getTicketStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    aberto: 'Aberto',
    'em-andamento': 'Em Andamento',
    aguardando: 'Aguardando',
    resolvido: 'Resolvido',
    fechado: 'Fechado',
  };
  return labels[status] || status;
}

/**
 * Get color classes for ticket priority badges
 */
export function getTicketPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    baixa: 'bg-gray-100 text-gray-800',
    media: 'bg-blue-100 text-blue-800',
    alta: 'bg-orange-100 text-orange-800',
    urgente: 'bg-red-100 text-red-800',
  };
  return colors[priority] || 'bg-gray-100 text-gray-800';
}

/**
 * Get formatted label for ticket priority
 */
export function getTicketPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    baixa: 'Baixa',
    media: 'Média',
    alta: 'Alta',
    urgente: 'Urgente',
  };
  return labels[priority] || priority;
}
