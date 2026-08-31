import { getRequest } from '@/shared/utils/axiosRequest';

export function logout() {
  return getRequest<void>('auth/logout');
}
