import { postRequest } from '@/shared/utils/axiosRequest';
import type { ForgotPasswordPayload } from '@/modules/auth/types/forgotPassword';

export function forgotPassword(data: ForgotPasswordPayload) {
  return postRequest<void>('/auth/forgot-password', data);
}
