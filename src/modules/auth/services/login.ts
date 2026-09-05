import type { LoginPayload, LoginResponse } from '@/modules/auth/types/login';
import { postRequest } from '@/shared/utils/axiosRequest';

export function login(data: LoginPayload) {
  return postRequest<LoginResponse>('auth/login', data);
}
