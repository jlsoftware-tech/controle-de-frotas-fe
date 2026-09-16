import { useQuery } from '@tanstack/react-query';
import { getPermissions } from '../services/permissions.service';
import type { Permission } from '../types/profile';

const fetchPermissions = async (): Promise<Permission[]> => {
  const response = await getPermissions();
  if (response.success && response.data) return response.data;
  return [];
};

export function usePermissions() {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: fetchPermissions,
    staleTime: 1000 * 60 * 30,
  });
}
