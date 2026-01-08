import { useQuery } from '@tanstack/react-query';
import { ApiHttpClientService } from '@/service/api-http-client.service';
import { Ticket } from '@/lib/mock-data/tickets';

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
