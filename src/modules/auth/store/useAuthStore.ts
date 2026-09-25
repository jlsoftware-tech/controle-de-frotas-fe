import type { User } from '@/modules/users/types/user';
import { queryClient } from '@/shared/lib/react-query';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  user: User | null;
  token: string | null;
  remember: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRemember: (remember: boolean) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
};

const SESSION_COOKIE = 'auth_session';

const hasSessionCookie = () => document.cookie.split('; ').some((c) => c.startsWith(`${SESSION_COOKIE}=`));

const setSessionCookie = (active: boolean) => {
  document.cookie = active
    ? `${SESSION_COOKIE}=1; path=/; SameSite=Strict`
    : `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Strict`;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      remember: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setRemember: (remember) => {
        setSessionCookie(!remember);
        set({ remember });
      },
      logout: () => {
        setSessionCookie(false);
        set({ user: null, token: null, remember: false });
        queryClient.clear();
      },
      isAuthenticated: () => Boolean(get().token),
    }),
    {
      name: 'auth_storage',
      onRehydrateStorage: () => (state) => {
        if (state?.token && !state.remember && !hasSessionCookie()) {
          state.logout();
        }
      },
    }
  )
);

export default useAuthStore;
