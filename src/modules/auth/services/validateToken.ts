import type { User } from '@/modules/users/types/user';
import { getRequest } from '@/shared/utils/axiosRequest';

export function validateToken() {
  return getRequest<User>('/profile');
}
