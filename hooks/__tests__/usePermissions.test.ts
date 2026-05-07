const useSessionMock = jest.fn();

jest.mock("next-auth/react", () => ({
  useSession: () => useSessionMock(),
}));

import { usePermissions } from "@/hooks/usePermissions";

describe("usePermissions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("reuses useRole behavior for manager role", () => {
    useSessionMock.mockReturnValueOnce({ data: { user: { role: "manager" } } });
    const result = usePermissions();
    expect(result.role).toBe("manager");
    expect(result.canAssign).toBe(true);
    expect(result.canDelete).toBe(false);
  });
});
