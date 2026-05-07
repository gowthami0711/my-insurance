import { fireEvent, render, screen } from "@testing-library/react";

const useWorkspaceStoreMock = jest.fn();
const closeWorkspaceMock = jest.fn();

jest.mock("@/store/workspace.store", () => ({
  useWorkspaceStore: () => useWorkspaceStoreMock(),
}));

jest.mock("@/app/components/customer/CustomersTable", () => ({
  CustomersTable: () => <div>CustomersTable</div>,
}));

jest.mock("@/app/components/workspace/DocumentWorkspace", () => ({
  DocumentWorkspace: () => <div>DocumentWorkspace</div>,
}));

import { WorkspaceLayout } from "@/app/components/workspace/WorkspaceLayout";

describe("WorkspaceLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders only customer table when workspace closed", () => {
    useWorkspaceStoreMock.mockReturnValue({
      isWorkspaceOpen: false,
      closeWorkspace: closeWorkspaceMock,
    });

    render(<WorkspaceLayout />);
    expect(screen.getByText("CustomersTable")).toBeInTheDocument();
    expect(screen.queryByText("DocumentWorkspace")).not.toBeInTheDocument();
  });

  it("renders workspace modal and closes on backdrop click", () => {
    useWorkspaceStoreMock.mockReturnValue({
      isWorkspaceOpen: true,
      closeWorkspace: closeWorkspaceMock,
    });

    const { container } = render(<WorkspaceLayout />);
    expect(screen.getByText("DocumentWorkspace")).toBeInTheDocument();

    const backdrop = container.querySelector(".fixed.inset-0.z-40") as HTMLElement;
    fireEvent.click(backdrop);
    expect(closeWorkspaceMock).toHaveBeenCalled();
  });
});
