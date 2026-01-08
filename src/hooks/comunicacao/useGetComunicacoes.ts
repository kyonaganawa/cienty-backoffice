import { useQuery } from '@tanstack/react-query';
import { ApiHttpClientService } from '@/service/api-http-client.service';
import { Comunicacao } from '@/lib/mock-data/comunicacoes';

export const useGetComunicacoes = () => {
  return useQuery({
    queryKey: ['comunicacoes'],
    queryFn: async () => {
      const response = await ApiHttpClientService.get<void, { data: Comunicacao[]; total: number }>('/api/comunicacoes');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
