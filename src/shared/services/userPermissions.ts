import { getRequest } from '@/shared/utils/axiosRequest';
import type {
  PermissionModule,
  UserPermissionsResponse,
} from '../types/userPermissions';

export function getUserPermissions(modules?: PermissionModule[]) {
  const query = new URLSearchParams();
  modules?.forEach((module) => query.append('modules[]', module));

  const qs = query.toString();
  return getRequest<UserPermissionsResponse>(
    `users/permissions${qs ? `?${qs}` : ''}`
  );
}
