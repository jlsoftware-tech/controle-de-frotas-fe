import type { ResetPasswordPayload } from '@/modules/auth/types/resetPassword';
import { postRequest } from '@/shared/utils/axiosRequest';

export function resetPassword(data: ResetPasswordPayload) {
  return postRequest<void>('auth/reset-password', data);
}
