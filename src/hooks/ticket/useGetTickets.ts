import { useQuery } from '@tanstack/react-query';
import { ApiHttpClientService } from '@/service/api-http-client.service';

export interface Ticket {
  id: string;
  titulo: string;
  descricao: string;
  status: 'aberto' | 'em-andamento' | 'aguardando' | 'resolvido' | 'fechado';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  clienteId: string;
  clienteNome: string;
  dataCriacao: string;
}

export const useGetTickets = () => {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const response = await ApiHttpClientService.get<void, { data: Ticket[]; total: number }>('/api/tickets');
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (tickets update frequently)
  });
};
