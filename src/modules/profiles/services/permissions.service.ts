import { getRequest } from '@/shared/utils/axiosRequest';
import type { Permission } from '../types/profile';

export function getPermissions() {
  return getRequest<Permission[]>('/permissions');
}
