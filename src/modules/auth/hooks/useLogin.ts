import { login } from '@/modules/auth/services/login';
import type { LoginPayload } from '@/modules/auth/types/login';
import { useMutation } from '@tanstack/react-query';

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginPayload) => login(data),
  });
}
