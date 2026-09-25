import { getRequest } from '@/shared/utils/axiosRequest';
import type { GetPermissionsParams, PermissionsListing } from '../types/profile';

export function getPermissions(params?: GetPermissionsParams) {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', params.page.toString());
  if (params?.per_page) query.append('per_page', params.per_page.toString());
  if (params?.search) query.append('search', params.search);

  const qs = query.toString();
  return getRequest<PermissionsListing>(`permissions${qs ? `?${qs}` : ''}`);
}
