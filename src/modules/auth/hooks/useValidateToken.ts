import { validateToken } from '@/modules/auth/services/validateToken';
import useAuthStore from '@/modules/auth/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';

export function useValidateToken() {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ['validateToken', token],
    queryFn: async () => {
      const response = await validateToken();
      return response;
    },
    enabled: !!token,
    retry: false,
    staleTime: 1000 * 60 * 15,
  });
}
