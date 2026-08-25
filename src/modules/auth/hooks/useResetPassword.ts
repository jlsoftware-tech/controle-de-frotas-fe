import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '@/modules/auth/services/resetPassword';
import type { ResetPasswordPayload } from '@/modules/auth/types/resetPassword';

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordPayload) => resetPassword(data),
  });
}
