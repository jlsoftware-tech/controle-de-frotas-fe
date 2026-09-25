import type { User } from '@/modules/users/types/user';
import { queryClient } from '@/shared/lib/react-query';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

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

const STORAGE_KEY = 'auth_storage';

const isRemembered = (value: string) => {
  try {
    return Boolean(JSON.parse(value)?.state?.remember);
  } catch {
    return false;
  }
};

const authStorage: StateStorage = {
  getItem: (name) => {
    const persisted = localStorage.getItem(name);
    if (persisted && isRemembered(persisted)) return persisted;
    if (persisted) localStorage.removeItem(name);
    return sessionStorage.getItem(name);
  },
  setItem: (name, value) => {
    const [target, other] = isRemembered(value) ? [localStorage, sessionStorage] : [sessionStorage, localStorage];
    target.setItem(name, value);
    other.removeItem(name);
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      remember: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setRemember: (remember) => set({ remember }),
      logout: () => {
        set({ user: null, token: null, remember: false });
        queryClient.clear();
      },
      isAuthenticated: () => Boolean(get().token),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => authStorage),
    }
  )
);

const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('auth_sync') : null;

channel?.addEventListener('message', (event) => {
  if (event.data?.type !== 'request') return;
  const value = sessionStorage.getItem(STORAGE_KEY);
  if (value) channel.postMessage({ type: 'session', value });
});

export const syncSessionFromOtherTabs = (timeout = 200) =>
  new Promise<void>((resolve) => {
    if (!channel || authStorage.getItem(STORAGE_KEY)) return resolve();

    const finish = () => {
      clearTimeout(timer);
      channel.removeEventListener('message', onMessage);
      resolve();
    };
    const onMessage = async (event: MessageEvent) => {
      if (event.data?.type !== 'session') return;
      sessionStorage.setItem(STORAGE_KEY, event.data.value);
      await useAuthStore.persist.rehydrate();
      finish();
    };
    const timer = setTimeout(finish, timeout);

    channel.addEventListener('message', onMessage);
    channel.postMessage({ type: 'request' });
  });

export default useAuthStore;
