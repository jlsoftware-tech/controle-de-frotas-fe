import { useAuthStore } from '@/modules/auth/store/useAuthStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changePassword, updateInfo } from '../services/settings.service';

export function useSettings() {
  const queryClient = useQueryClient();

  const updateInfoMutation = useMutation({
    mutationFn: updateInfo,
    onSuccess: (res) => {
      if (!res.success || !res.data) return;
      // A API devolve o usuário sem `profile`/`secretariat`, então só mesclamos os dados pessoais.
      const { user, setUser } = useAuthStore.getState();
      if (user) setUser({ ...user, name: res.data.name, email: res.data.email });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
  });

  return {
    updateInfoMutation,
    changePasswordMutation,
  };
}
