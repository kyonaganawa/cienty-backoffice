import { useQuery } from '@tanstack/react-query';
import { ApiHttpClientService } from '@/service/api-http-client.service';
import { Distribuidora } from '@/lib/mock-data/distribuidoras';

export const useGetDistribuidoraById = (id: string) => {
  return useQuery({
    queryKey: ['distribuidora', id],
    queryFn: async () => {
      const response = await ApiHttpClientService.get<void, { data: Distribuidora }>(
        `/api/distribuidoras/${id}`
      );
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
