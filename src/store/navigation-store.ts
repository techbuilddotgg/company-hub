import { create } from 'zustand';

interface NavigationStoreState {
  isOpened: boolean;
  setIsOpened: (isOpened: boolean) => void;
}
export const useNavigationStore = create<NavigationStoreState>((set) => ({
  isOpened: false,
  setIsOpened: (isOpened) => set({ isOpened }),
}));
