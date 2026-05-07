import { useAuthStore } from "@/store/auth.store";

describe("auth store", () => {
  beforeEach(() => {
    useAuthStore.setState({
      role: "viewer",
      permissions: {
        canEdit: false,
        canDelete: false,
        canAssign: false,
        canExport: false,
        canViewStats: true,
      },
    });
  });

  it("setRole updates role and permissions", () => {
    useAuthStore.getState().setRole("admin");
    const state = useAuthStore.getState();
    expect(state.role).toBe("admin");
    expect(state.permissions.canDelete).toBe(true);
  });
});
