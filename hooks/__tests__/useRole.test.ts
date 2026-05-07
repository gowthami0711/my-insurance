const useSessionMock = jest.fn();

jest.mock("next-auth/react", () => ({
  useSession: () => useSessionMock(),
}));

import { useRole } from "@/hooks/useRole";

describe("useRole", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("defaults to viewer role when session is missing", () => {
    useSessionMock.mockReturnValueOnce({ data: null });
    const result = useRole();
    expect(result.role).toBe("viewer");
    expect(result.canEdit).toBe(false);
  });

  it("returns session role permissions", () => {
    useSessionMock.mockReturnValueOnce({ data: { user: { role: "admin" } } });
    const result = useRole();
    expect(result.role).toBe("admin");
    expect(result.canDelete).toBe(true);
  });
});
