import { getUserPermissions } from '@/shared/services/userPermissions';
import type {
  PermissionAction,
  PermissionModule,
} from '@/shared/types/userPermissions';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

export const USER_PERMISSIONS_QUERY_KEY = 'user-permissions';

/**
 * Consulta as permissões do usuário logado para um módulo.
 * Enquanto carrega (ou em caso de erro) `can` retorna `false`, então a ação fica oculta.
 */
export default function useUserPermissions(module: PermissionModule) {
  const { data, isLoading } = useQuery({
    queryKey: [USER_PERMISSIONS_QUERY_KEY, module],
    queryFn: async () => {
      const response = await getUserPermissions([module]);
      return response.success && response.data
        ? (response.data[module] ?? {})
        : {};
    },
    // Permissões podem mudar a qualquer momento (edição de perfil), então sempre revalida
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const can = useCallback(
    (action: PermissionAction) => data?.[action] === true,
    [data]
  );

  return { can, isLoading };
}
