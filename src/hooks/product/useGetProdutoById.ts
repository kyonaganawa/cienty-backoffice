import { useQuery } from '@tanstack/react-query';
import { ApiHttpClientService } from '@/service/api-http-client.service';
import { Produto } from '@/lib/mock-data/produtos';

export const useGetProdutoById = (id: string) => {
  return useQuery({
    queryKey: ['produto', id],
    queryFn: async () => {
      const response = await ApiHttpClientService.get<void, { data: Produto }>(
        `/api/produtos/${id}`
      );
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
