import useAuthStore from '@/modules/auth/store/useAuthStore';
import { USER_PERMISSIONS_QUERY_KEY } from '@/shared/hooks/useUserPermissions';
import { getNavigation } from '@/shared/services/navigation';
import type { NavigationResponse } from '@/shared/types/navigationMenuItem';
import { useQuery } from '@tanstack/react-query';

const emptyMenu: NavigationResponse = [];

export default function useNavigationMenu() {
  const user = useAuthStore((s) => s.user);

  const { data, isLoading } = useQuery({
    queryKey: [USER_PERMISSIONS_QUERY_KEY, 'sidebar'],
    queryFn: async () => {
      const response = await getNavigation();
      return response.success && response.data ? response.data : emptyMenu;
    },
    enabled: !!user,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  return { items: data ?? emptyMenu, isLoading };
}
