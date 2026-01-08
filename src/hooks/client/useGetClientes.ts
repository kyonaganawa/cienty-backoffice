import { useQuery } from '@tanstack/react-query';
import { ApiHttpClientService } from '@/service/api-http-client.service';
import { Cliente } from '@/lib/mock-data/clientes';

export const useGetClientes = () => {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      const response = await ApiHttpClientService.get<void, { data: Cliente[]; total: number }>('/api/clientes');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
