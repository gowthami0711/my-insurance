import { useUIStore } from "@/store/ui-store";

describe("ui store", () => {
  beforeEach(() => {
    useUIStore.setState({ isSidebarCollapsed: false, isMobileMenuOpen: false });
  });

  it("toggles sidebar state", () => {
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().isSidebarCollapsed).toBe(true);
  });

  it("opens and closes mobile menu", () => {
    useUIStore.getState().openMobileMenu();
    expect(useUIStore.getState().isMobileMenuOpen).toBe(true);
    useUIStore.getState().closeMobileMenu();
    expect(useUIStore.getState().isMobileMenuOpen).toBe(false);
  });
});
