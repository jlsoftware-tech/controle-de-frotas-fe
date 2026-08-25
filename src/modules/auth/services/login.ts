import { postRequest } from '@/shared/utils/axiosRequest';
import type { LoginPayload, LoginResponse } from '@/modules/auth/types/login';

export function login(data: LoginPayload) {
  return postRequest<LoginResponse>('/auth/login', data);
}
