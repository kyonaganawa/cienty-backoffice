import { useQuery } from '@tanstack/react-query';
import { ApiHttpClientService } from '@/service/api-http-client.service';
import { Colecao } from '@/lib/mock-data/colecoes';

export const useGetColecoes = () => {
  return useQuery({
    queryKey: ['colecoes'],
    queryFn: async () => {
      const response = await ApiHttpClientService.get<void, { data: Colecao[]; total: number }>('/api/colecoes');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
