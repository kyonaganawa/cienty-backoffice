import { useQuery } from '@tanstack/react-query';
import { ApiHttpClientService } from '@/service/api-http-client.service';
import { TicketTag } from '@/lib/mock-data/tickets';

export const useGetTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await ApiHttpClientService.get<void, { data: TicketTag[]; total: number }>('/api/tags');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes (tags don't change often)
  });
};
