import { useQuery } from '@tanstack/react-query';
import { ApiHttpClientService } from '@/service/api-http-client.service';
import { Cliente } from '@/lib/mock-data/clientes';

export const useGetClienteById = (id: string) => {
  return useQuery({
    queryKey: ['cliente', id],
    queryFn: async () => {
      // Staging API returns client object directly, not wrapped in { data: {...} }
      const response = await ApiHttpClientService.get<void, Cliente>(`/api/clientes/${id}`);
      return response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
