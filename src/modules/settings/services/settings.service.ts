import type { User } from '@/modules/users/types/user';
import { putRequest } from '@/shared/utils/axiosRequest';
import type { ChangePasswordPayload, UpdateInfoPayload } from '../types/settings';

export function updateInfo(data: UpdateInfoPayload) {
  return putRequest<User>('users/update', data);
}

export function changePassword(data: ChangePasswordPayload) {
  return putRequest<null>('users/reset-password', data);
}
