import { useQuery } from '@tanstack/react-query';
import { ApiHttpClientService } from '@/service/api-http-client.service';
import { Loja } from '@/lib/mock-data/lojas';

export const useGetLojas = () => {
  return useQuery({
    queryKey: ['lojas'],
    queryFn: async () => {
      const response = await ApiHttpClientService.get<void, { data: Loja[]; total: number }>('/api/lojas');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
