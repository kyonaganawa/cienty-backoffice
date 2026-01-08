import { useQuery } from '@tanstack/react-query';
import { ApiHttpClientService } from '@/service/api-http-client.service';
import { Cliente } from '@/lib/mock-data/clientes';

export const useGetClienteById = (id: string) => {
  return useQuery({
    queryKey: ['cliente', id],
    queryFn: async () => {
      const response = await ApiHttpClientService.get<void, { data: Cliente }>(`/api/clientes/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
