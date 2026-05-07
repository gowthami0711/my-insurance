import { fireEvent, render, screen } from "@testing-library/react";

const useQueryMock = jest.fn();
const useQueryClientMock = jest.fn();
const useWorkspaceStoreMock = jest.fn();
const usePermissionsMock = jest.fn();

jest.mock("@tanstack/react-query", () => ({
  useQuery: (...args: unknown[]) => useQueryMock(...args),
  useQueryClient: () => useQueryClientMock(),
}));

jest.mock("@/store/workspace.store", () => ({
  useWorkspaceStore: () => useWorkspaceStoreMock(),
}));

jest.mock("@/hooks/usePermissions", () => ({
  usePermissions: () => usePermissionsMock(),
}));

import { DocumentList } from "@/app/components/workspace/DocumentList";

describe("DocumentList", () => {
  const setActiveDocument = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useQueryClientMock.mockReturnValue({ invalidateQueries: jest.fn() });
    useWorkspaceStoreMock.mockReturnValue({
      activeDocumentId: null,
      setActiveDocument,
    });
    usePermissionsMock.mockReturnValue({ canEdit: true });
    global.alert = jest.fn();
  });

  it("shows empty-state text when no documents", () => {
    useQueryMock.mockReturnValue({ data: [], isLoading: false });
    render(<DocumentList customerId="c1" />);
    expect(screen.getByText("No documents yet")).toBeInTheDocument();
  });

  it("selects document on click", () => {
    useQueryMock.mockReturnValue({
      data: [
        {
          id: "d1",
          name: "policy.pdf",
          size: 1024,
          pages: 2,
          _count: { comments: 1, annotations: 1 },
        },
      ],
      isLoading: false,
    });

    render(<DocumentList customerId="c1" />);
    fireEvent.click(screen.getByRole("button", { name: /policy\.pdf/i }));
    expect(setActiveDocument).toHaveBeenCalledWith("d1");
  });

  it("rejects non-pdf uploads", () => {
    useQueryMock.mockReturnValue({ data: [], isLoading: false });
    const { container } = render(<DocumentList customerId="c1" />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["abc"], "note.txt", { type: "text/plain" });

    fireEvent.change(input, { target: { files: [file] } });
    expect(global.alert).toHaveBeenCalledWith("Only PDF files are allowed.");
  });
});
