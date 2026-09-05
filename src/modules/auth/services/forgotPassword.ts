import type { ForgotPasswordPayload } from '@/modules/auth/types/forgotPassword';
import { postRequest } from '@/shared/utils/axiosRequest';

export function forgotPassword(data: ForgotPasswordPayload) {
  return postRequest<void>('auth/forgot-password', data);
}
