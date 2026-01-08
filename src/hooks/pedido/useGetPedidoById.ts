import { useQuery } from '@tanstack/react-query';
import { ApiHttpClientService } from '@/service/api-http-client.service';
import { Pedido } from '@/lib/mock-data/pedidos';

export const useGetPedidoById = (id: string) => {
  return useQuery({
    queryKey: ['pedido', id],
    queryFn: async () => {
      const response = await ApiHttpClientService.get<void, { data: Pedido }>(
        `/api/pedidos/${id}`
      );
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
