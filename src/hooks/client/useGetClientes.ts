import { useQuery } from '@tanstack/react-query';
import { ApiHttpClientService } from '@/service/api-http-client.service';
import { Cliente } from '@/lib/mock-data/clientes';

export const useGetClientes = () => {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      // Staging API returns array directly, not wrapped in { data: [...] }
      const response = await ApiHttpClientService.get<void, Cliente[]>('/api/clientes');
      return response;
    },
    staleTime: 5 * 60 * 1000,
  });
};
