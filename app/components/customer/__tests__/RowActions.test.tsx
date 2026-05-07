import { fireEvent, render, screen } from "@testing-library/react";

const useCustomersStoreMock = jest.fn();
const usePermissionsMock = jest.fn();

jest.mock("@/store/customers.store", () => ({
  useCustomersStore: () => useCustomersStoreMock(),
}));

jest.mock("@/hooks/usePermissions", () => ({
  usePermissions: () => usePermissionsMock(),
}));

import { RowActions } from "@/app/components/customer/RowActions";

describe("RowActions", () => {
  const setEditingCustomer = jest.fn();
  const setDeletingCustomer = jest.fn();
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
    jest.clearAllMocks();
    useCustomersStoreMock.mockReturnValue({
      setEditingCustomer,
      setDeletingCustomer,
    });
    usePermissionsMock.mockReturnValue({
      canEdit: true,
      canDelete: true,
      canAssign: true,
    });
  });

  it("triggers edit action", () => {
    render(<RowActions customer={customer} />);
    fireEvent.click(screen.getByRole("button", { name: "⋮" }));
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(setEditingCustomer).toHaveBeenCalledWith(customer);
  });

  it("triggers delete action", () => {
    render(<RowActions customer={customer} />);
    fireEvent.click(screen.getByRole("button", { name: "⋮" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(setDeletingCustomer).toHaveBeenCalledWith(customer);
  });
});
