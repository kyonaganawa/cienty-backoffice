import { useQuery } from '@tanstack/react-query';
import { ApiHttpClientService } from '@/service/api-http-client.service';
import { Cliente } from '@/lib/mock-data/clientes';

export const useGetClientes = () => {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      // Staging API returns array directly, not wrapped in { data: [...] }
      const response = await ApiHttpClientService.get<void, Cliente[]>('/api/clientes');
      console.info('[useGetClientes] Response:', Array.isArray(response) ? `Array with ${response.length} items` : typeof response);

      // Ensure we always return an array
      if (!response) {
        console.warn('[useGetClientes] Response is null/undefined, returning empty array');
        return [];
      }

      return response;
    },
    staleTime: 5 * 60 * 1000,
  });
};
