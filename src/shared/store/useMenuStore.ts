import { getNavigation } from '@/shared/services/navigation';
import type { NavigationResponse } from '@/shared/types/navigationMenuItem';
import { create } from 'zustand';

type MenuState = {
  items: NavigationResponse;
  isLoading: boolean;
  hasFetched: boolean;
  fetchMenu: () => Promise<void>;
  clear: () => void;
};

export const useMenuStore = create<MenuState>((set, get) => ({
  items: [],
  isLoading: false,
  hasFetched: false,
  fetchMenu: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    const response = await getNavigation();
    set({
      items: response.success && response.data ? response.data : [],
      isLoading: false,
      hasFetched: true,
    });
  },
  clear: () => set({ items: [], isLoading: false, hasFetched: false }),
}));

export default useMenuStore;
