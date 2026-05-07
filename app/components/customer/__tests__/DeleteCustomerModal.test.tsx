import { fireEvent, render, screen } from "@testing-library/react";

const useDeleteCustomerMock = jest.fn();

jest.mock("@/hooks/useCustomerMutation", () => ({
  useDeleteCustomer: () => useDeleteCustomerMock(),
}));

import { DeleteCustomerModal } from "@/app/components/customer/DeleteCustomerModal";

describe("DeleteCustomerModal", () => {
  const mutate = jest.fn();
  const onClose = jest.fn();
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
    useDeleteCustomerMock.mockReturnValue({ mutate, isPending: false });
  });

  it("returns null when customer is missing", () => {
    const { container } = render(<DeleteCustomerModal customer={null} onClose={onClose} />);
    expect(container.firstChild).toBeNull();
  });

  it("calls delete mutation for selected customer", () => {
    render(<DeleteCustomerModal customer={customer} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(mutate).toHaveBeenCalledWith("c1", expect.any(Object));
    const [, options] = mutate.mock.calls[0];
    options.onSuccess();
    expect(onClose).toHaveBeenCalled();
  });
});
