import { fireEvent, render, screen } from "@testing-library/react";

const useCustomersMock = jest.fn();
const useCustomersStoreMock = jest.fn();
const usePermissionsMock = jest.fn();
const useWorkspaceStoreMock = jest.fn();

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: { alt: string }) => <span>{props.alt}</span>,
}));

jest.mock("@/hooks/useCustomers", () => ({
  useCustomers: () => useCustomersMock(),
}));

jest.mock("@/store/customers.store", () => ({
  useCustomersStore: () => useCustomersStoreMock(),
}));

jest.mock("@/hooks/usePermissions", () => ({
  usePermissions: () => usePermissionsMock(),
}));

jest.mock("@/store/workspace.store", () => ({
  useWorkspaceStore: () => useWorkspaceStoreMock(),
}));

jest.mock("@/app/components/customer/AddCustomerModal", () => ({
  AddCustomerModal: () => <div data-testid="add-modal" />,
}));
jest.mock("@/app/components/customer/EditCustomerModal", () => ({
  EditCustomerModal: () => <div data-testid="edit-modal" />,
}));
jest.mock("@/app/components/customer/DeleteCustomerModal", () => ({
  DeleteCustomerModal: () => <div data-testid="delete-modal" />,
}));
jest.mock("@/app/components/customer/RowActions", () => ({
  RowActions: () => <div data-testid="row-actions" />,
}));

import { CustomersTable } from "@/app/components/customer/CustomersTable";

describe("CustomersTable", () => {
  const setSearch = jest.fn();
  const setPage = jest.fn();
  const setSortBy = jest.fn();
  const setIsAddingCustomer = jest.fn();
  const setEditingCustomer = jest.fn();
  const setDeletingCustomer = jest.fn();
  const openWorkspace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useCustomersMock.mockReturnValue({
      data: {
        customers: [
          {
            id: "c1",
            name: "Jane Doe",
            company: "ACME",
            phone: "1234567",
            email: "jane@example.com",
            country: "India",
            status: "Active",
          },
        ],
        total: 1,
        page: 1,
        totalPages: 1,
      },
      isLoading: false,
      isError: false,
    });

    useCustomersStoreMock.mockReturnValue({
      search: "",
      page: 1,
      sortBy: "newest",
      isAddingCustomer: false,
      editingCustomer: null,
      deletingCustomer: null,
      setSearch,
      setPage,
      setSortBy,
      setIsAddingCustomer,
      setEditingCustomer,
      setDeletingCustomer,
    });

    usePermissionsMock.mockReturnValue({
      canEdit: true,
      canDelete: true,
      canAssign: true,
    });

    useWorkspaceStoreMock.mockReturnValue({ openWorkspace });
  });

  it("renders customer row and opens workspace on row click", () => {
    render(<CustomersTable />);
    fireEvent.click(screen.getByText("Jane Doe"));
    expect(openWorkspace).toHaveBeenCalled();
  });

  it("opens add modal flow when Add Customer clicked", () => {
    render(<CustomersTable />);
    fireEvent.click(screen.getByRole("button", { name: "+ Add Customer" }));
    expect(setIsAddingCustomer).toHaveBeenCalledWith(true);
  });
});
