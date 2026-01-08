import { useQuery } from '@tanstack/react-query';
import { ApiHttpClientService } from '@/service/api-http-client.service';
import { Ticket } from '@/lib/mock-data/tickets';

export const useGetTicketById = (id: string) => {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const response = await ApiHttpClientService.get<void, { data: Ticket }>(
        `/api/tickets/${id}`
      );
      return response.data;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
};
