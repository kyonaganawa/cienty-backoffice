import { useQuery } from '@tanstack/react-query';
import { ApiHttpClientService } from '@/service/api-http-client.service';
import { Distribuidora } from '@/lib/mock-data/distribuidoras';

export const useGetDistribuidoras = () => {
  return useQuery({
    queryKey: ['distribuidoras'],
    queryFn: async () => {
      const response = await ApiHttpClientService.get<void, { data: Distribuidora[]; total: number }>('/api/distribuidoras');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
