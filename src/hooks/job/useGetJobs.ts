import { useQuery } from '@tanstack/react-query';
import { ApiHttpClientService } from '@/service/api-http-client.service';
import { Job } from '@/lib/mock-data/jobs';

export const useGetJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const response = await ApiHttpClientService.get<void, { data: Job[]; total: number }>('/api/jobs');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
