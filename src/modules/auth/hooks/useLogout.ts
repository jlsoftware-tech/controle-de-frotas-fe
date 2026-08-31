import { useMutation } from '@tanstack/react-query';
import { logout } from '@/modules/auth/services/logout';

export function useLogout() {
  return useMutation({
    mutationFn: logout,
  });
}
