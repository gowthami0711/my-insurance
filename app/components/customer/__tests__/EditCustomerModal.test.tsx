import { fireEvent, render, screen } from "@testing-library/react";

const useUpdateCustomerMock = jest.fn();

jest.mock("@/hooks/useCustomerMutation", () => ({
  useUpdateCustomer: () => useUpdateCustomerMock(),
}));

import { EditCustomerModal } from "@/app/components/customer/EditCustomerModal";

describe("EditCustomerModal", () => {
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
    useUpdateCustomerMock.mockReturnValue({ mutate, isPending: false });
  });

  it("returns null when customer is not provided", () => {
    const { container } = render(<EditCustomerModal customer={null} onClose={onClose} />);
    expect(container.firstChild).toBeNull();
  });

  it("submits edited customer data", () => {
    render(<EditCustomerModal customer={customer} onClose={onClose} />);
    fireEvent.change(screen.getAllByRole("textbox")[0], { target: { value: "Jane Updated" } });
    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

    expect(mutate).toHaveBeenCalled();
    const [payload, options] = mutate.mock.calls[0];
    expect(payload.id).toBe("c1");
    options.onSuccess();
    expect(onClose).toHaveBeenCalled();
  });
});
