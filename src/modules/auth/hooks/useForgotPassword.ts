import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '@/modules/auth/services/forgotPassword';
import type { ForgotPasswordPayload } from '@/modules/auth/types/forgotPassword';

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordPayload) => forgotPassword(data),
  });
}
