import { create } from "zustand";

type UIStore = {
  isSidebarCollapsed: boolean;
  isMobileMenuOpen: boolean;
  toggleSidebar: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
};

export const useUIStore = create<UIStore>((set) => ({
  isSidebarCollapsed: false,
  isMobileMenuOpen: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}));