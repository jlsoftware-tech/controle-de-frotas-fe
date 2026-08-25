import { useMutation } from '@tanstack/react-query';
import { login } from '@/modules/auth/services/login';
import type { LoginPayload } from '@/modules/auth/types/login';

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginPayload) => login(data),
  });
}
