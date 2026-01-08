import { useQuery } from '@tanstack/react-query';
import { ApiHttpClientService } from '@/service/api-http-client.service';

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  categoria: string;
  ativo: boolean;
}

export const useGetProdutos = () => {
  return useQuery({
    queryKey: ['produtos'],
    queryFn: async () => {
      const response = await ApiHttpClientService.get<void, { data: Produto[]; total: number }>('/api/produtos');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
