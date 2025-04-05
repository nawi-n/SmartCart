import { useQuery } from '@tanstack/react-query';
import { getRecommendations } from '../api/client';

export const useRecommendations = (customerId: string) => {
  return useQuery({
    queryKey: ['recommendations', customerId],
    queryFn: () => getRecommendations(customerId),
    enabled: !!customerId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}; 