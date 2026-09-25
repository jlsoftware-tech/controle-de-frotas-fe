import { getUserPermissions } from '@/shared/services/userPermissions';
import type { PermissionAction, PermissionModule } from '@/shared/types/userPermissions';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

export const USER_PERMISSIONS_QUERY_KEY = 'user-permissions';

export default function useUserPermissions(module: PermissionModule) {
  const { data, isLoading, isFetchedAfterMount } = useQuery({
    queryKey: [USER_PERMISSIONS_QUERY_KEY, module],
    queryFn: async () => {
      const response = await getUserPermissions([module]);
      return response.success && response.data
        ? (response.data[module] ?? {})
        : {};
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const can = useCallback(
    (action: PermissionAction) => data?.[action] === true,
    [data]
  );

  return { can, isLoading, isFetchedAfterMount };
}
