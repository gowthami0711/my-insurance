import { fireEvent, render, screen } from "@testing-library/react";

const useWorkspaceStoreMock = jest.fn();
const useSessionMock = jest.fn();
const usePermissionsMock = jest.fn();
const useQueryMock = jest.fn();
const useMutationMock = jest.fn();
const useQueryClientMock = jest.fn();

jest.mock("@/store/workspace.store", () => ({
  useWorkspaceStore: () => useWorkspaceStoreMock(),
}));
jest.mock("next-auth/react", () => ({
  useSession: () => useSessionMock(),
}));
jest.mock("@/hooks/usePermissions", () => ({
  usePermissions: () => usePermissionsMock(),
}));
jest.mock("@tanstack/react-query", () => ({
  useQuery: (...args: unknown[]) => useQueryMock(...args),
  useMutation: (...args: unknown[]) => useMutationMock(...args),
  useQueryClient: () => useQueryClientMock(),
}));

import { DocumentTools } from "@/app/components/workspace/DocumentTools";

describe("DocumentTools", () => {
  const mutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useWorkspaceStoreMock.mockReturnValue({ activeDocumentId: "d1", activePage: 1 });
    useSessionMock.mockReturnValue({ data: { user: { name: "Jane" } } });
    usePermissionsMock.mockReturnValue({ canEdit: true });
    useQueryClientMock.mockReturnValue({ invalidateQueries: jest.fn() });
    useQueryMock.mockImplementation((config: { queryKey: [string, string] }) => {
      if (config.queryKey[0] === "comments") {
        return {
          data: [
            {
              id: "c1",
              page: 1,
              content: "looks good",
              author: "Jane",
              createdAt: new Date().toISOString(),
            },
          ],
        };
      }
      return { data: [] };
    });
    useMutationMock.mockReturnValue({ mutate, isPending: false });
  });

  it("returns null when no active document", () => {
    useWorkspaceStoreMock.mockReturnValueOnce({ activeDocumentId: null, activePage: 1 });
    const { container } = render(<DocumentTools />);
    expect(container.firstChild).toBeNull();
  });

  it("renders page comments", () => {
    render(<DocumentTools />);
    expect(screen.getByText("looks good")).toBeInTheDocument();
  });

  it("calls add-comment mutation on button click", () => {
    render(<DocumentTools />);
    fireEvent.change(screen.getByPlaceholderText("Add a comment..."), { target: { value: "new note" } });
    fireEvent.click(screen.getByRole("button", { name: "Add Comment" }));
    expect(mutate).toHaveBeenCalled();
  });
});
