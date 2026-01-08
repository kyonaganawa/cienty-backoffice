import { useQuery } from '@tanstack/react-query';
import { ApiHttpClientService } from '@/service/api-http-client.service';
import { Produto } from '@/lib/mock-data/produtos';

export const useGetProdutos = () => {
  return useQuery({
    queryKey: ['produtos'],
    queryFn: async () => {
      const response = await ApiHttpClientService.get<void, { data: Produto[]; total: number }>('/api/produtos');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
