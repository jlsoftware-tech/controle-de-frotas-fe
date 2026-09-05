import { logout } from '@/modules/auth/services/logout';
import { useMutation } from '@tanstack/react-query';

export function useLogout() {
  return useMutation({
    mutationFn: logout,
  });
}
