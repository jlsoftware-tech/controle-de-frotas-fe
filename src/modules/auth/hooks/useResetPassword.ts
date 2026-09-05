import { resetPassword } from '@/modules/auth/services/resetPassword';
import type { ResetPasswordPayload } from '@/modules/auth/types/resetPassword';
import { useMutation } from '@tanstack/react-query';

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordPayload) => resetPassword(data),
  });
}
