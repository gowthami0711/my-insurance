import { fireEvent, render, screen } from "@testing-library/react";

const useWorkspaceStoreMock = jest.fn();
const useQueryMock = jest.fn();

jest.mock("@/store/workspace.store", () => ({
  useWorkspaceStore: () => useWorkspaceStoreMock(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: (...args: unknown[]) => useQueryMock(...args),
}));

import { DocumentViewer } from "@/app/components/workspace/DocumentViewer";

describe("DocumentViewer", () => {
  const setActivePage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows select-document empty state without active document", () => {
    useWorkspaceStoreMock.mockReturnValue({
      activeDocumentId: null,
      activePage: 1,
      setActivePage,
    });
    useQueryMock.mockReturnValue({ data: undefined, isLoading: false });
    render(<DocumentViewer />);
    expect(screen.getByText("Select a document")).toBeInTheDocument();
  });

  it("renders document details and page controls", () => {
    useWorkspaceStoreMock.mockReturnValue({
      activeDocumentId: "d1",
      activePage: 2,
      setActivePage,
    });
    useQueryMock.mockReturnValue({
      data: { name: "policy.pdf", pages: 4, viewUrl: "https://file-url" },
      isLoading: false,
    });

    render(<DocumentViewer />);
    expect(screen.getByText("policy.pdf")).toBeInTheDocument();
    expect(screen.getByText("Page 2 of 4")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "<" }));
    expect(setActivePage).toHaveBeenCalledWith(1);
  });
});
