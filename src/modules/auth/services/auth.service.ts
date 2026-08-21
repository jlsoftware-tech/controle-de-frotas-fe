import { getRequest } from '@/shared/utils/axiosRequest';

export function validateToken() {
  return getRequest<{ valid: boolean }>('/auth/validate');
}
