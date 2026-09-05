import { getRequest } from '@/shared/utils/axiosRequest';
import type { NavigationResponse } from '../types/navigationMenuItem';

export function getNavigation() {
  return getRequest<NavigationResponse>(`profile`);
}
