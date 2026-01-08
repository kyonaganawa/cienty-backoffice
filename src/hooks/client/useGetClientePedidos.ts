import { useQuery } from '@tanstack/react-query';
import { ApiHttpClientService } from '@/service/api-http-client.service';
import { Pedido } from '@/lib/mock-data/pedidos';

export const useGetClientePedidos = (clienteId: string) => {
  return useQuery({
    queryKey: ['cliente-pedidos', clienteId],
    queryFn: async () => {
      const response = await ApiHttpClientService.get<void, { data: Pedido[]; total: number }>(
        `/api/clientes/${clienteId}/pedidos`
      );
      return response.data;
    },
    enabled: !!clienteId,
    staleTime: 5 * 60 * 1000,
  });
};
