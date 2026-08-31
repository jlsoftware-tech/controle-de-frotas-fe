import { postRequest } from '@/shared/utils/axiosRequest';
import type { ResetPasswordPayload } from '@/modules/auth/types/resetPassword';

export function resetPassword(data: ResetPasswordPayload) {
  return postRequest<void>('auth/reset-password', data);
}
