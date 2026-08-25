import type { User } from '@/modules/auth/types/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
      isAuthenticated: () => Boolean(get().token),
    }),
    {
      name: 'auth_storage',
    }
  )
);

export default useAuthStore;
