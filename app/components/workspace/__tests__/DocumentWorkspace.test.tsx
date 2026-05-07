import { fireEvent, render, screen } from "@testing-library/react";

const useWorkspaceStoreMock = jest.fn();

jest.mock("@/store/workspace.store", () => ({
  useWorkspaceStore: () => useWorkspaceStoreMock(),
}));

jest.mock("@/app/components/workspace/DocumentList", () => ({
  DocumentList: ({ customerId }: { customerId: string }) => <div>List-{customerId}</div>,
}));
jest.mock("@/app/components/workspace/DocumentViewer", () => ({
  DocumentViewer: () => <div>Viewer</div>,
}));
jest.mock("@/app/components/workspace/DocumentTools", () => ({
  DocumentTools: () => <div>Tools</div>,
}));

import { DocumentWorkspace } from "@/app/components/workspace/DocumentWorkspace";

describe("DocumentWorkspace", () => {
  const closeWorkspace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when workspace is closed", () => {
    useWorkspaceStoreMock.mockReturnValue({
      isWorkspaceOpen: false,
      selectedCustomer: null,
      closeWorkspace,
    });
    const { container } = render(<DocumentWorkspace />);
    expect(container.firstChild).toBeNull();
  });

  it("renders workspace and closes on close button click", () => {
    useWorkspaceStoreMock.mockReturnValue({
      isWorkspaceOpen: true,
      selectedCustomer: {
        id: "c1",
        name: "Jane",
        company: "ACME",
        status: "Active",
      },
      closeWorkspace,
    });
    render(<DocumentWorkspace />);

    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("List-c1")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "X" }));
    expect(closeWorkspace).toHaveBeenCalled();
  });
});
