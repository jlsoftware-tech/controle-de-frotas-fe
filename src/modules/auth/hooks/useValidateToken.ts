import { useQuery } from '@tanstack/react-query';
import { validateToken } from '@/modules/auth/services/auth.service';

export function useValidateToken() {
  return useQuery({
    queryKey: ['validateToken'],
    queryFn: async () => {
      const response = await validateToken();
      return response;
    },
    retry: false,
    staleTime: 1000 * 60 * 15, // 15 minutos
  });
}
