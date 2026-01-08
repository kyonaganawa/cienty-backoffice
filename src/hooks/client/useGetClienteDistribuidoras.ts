import { useQuery } from '@tanstack/react-query';
import { ApiHttpClientService } from '@/service/api-http-client.service';
import { Distribuidora } from '@/lib/mock-data/distribuidoras';

export const useGetClienteDistribuidoras = (clienteId: string) => {
  return useQuery({
    queryKey: ['cliente-distribuidoras', clienteId],
    queryFn: async () => {
      const response = await ApiHttpClientService.get<void, { data: Distribuidora[]; total: number }>(
        `/api/clientes/${clienteId}/distribuidoras`
      );
      return response.data;
    },
    enabled: !!clienteId,
    staleTime: 5 * 60 * 1000,
  });
};
