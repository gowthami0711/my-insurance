import { useWorkspaceStore } from "@/store/workspace.store";

describe("workspace store", () => {
  const customer = {
    id: "c1",
    name: "Jane",
    company: "ACME",
    phone: "1234567",
    email: "jane@example.com",
    country: "India",
    status: "Active" as const,
  };

  beforeEach(() => {
    useWorkspaceStore.setState({
      selectedCustomer: null,
      isWorkspaceOpen: false,
      activeDocumentId: null,
      activePage: 1,
    });
  });

  it("openWorkspace sets customer and opens workspace", () => {
    useWorkspaceStore.getState().openWorkspace(customer);
    const state = useWorkspaceStore.getState();
    expect(state.isWorkspaceOpen).toBe(true);
    expect(state.selectedCustomer?.id).toBe("c1");
  });

  it("setActiveDocument resets page", () => {
    useWorkspaceStore.setState({ activePage: 5 });
    useWorkspaceStore.getState().setActiveDocument("d1");
    const state = useWorkspaceStore.getState();
    expect(state.activeDocumentId).toBe("d1");
    expect(state.activePage).toBe(1);
  });
});
