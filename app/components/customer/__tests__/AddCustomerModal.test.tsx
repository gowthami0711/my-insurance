import { fireEvent, render, screen } from "@testing-library/react";

const useCreateCustomerMock = jest.fn();

jest.mock("@/hooks/useCustomerMutation", () => ({
  useCreateCustomer: () => useCreateCustomerMock(),
}));

import { AddCustomerModal } from "@/app/components/customer/AddCustomerModal";

describe("AddCustomerModal", () => {
  const mutate = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useCreateCustomerMock.mockReturnValue({ mutate, isPending: false });
  });

  it("does not render when closed", () => {
    const { container } = render(<AddCustomerModal isOpen={false} onClose={onClose} />);
    expect(container.firstChild).toBeNull();
  });

  it("submits form and calls close on success", () => {
    render(<AddCustomerModal isOpen onClose={onClose} />);

    const textboxes = screen.getAllByRole("textbox");
    fireEvent.change(textboxes[0], { target: { value: "Jane" } });
    fireEvent.change(textboxes[1], { target: { value: "ACME" } });
    fireEvent.change(textboxes[2], { target: { value: "1234567" } });
    fireEvent.change(textboxes[3], { target: { value: "jane@example.com" } });
    fireEvent.change(textboxes[4], { target: { value: "India" } });

    fireEvent.click(screen.getByRole("button", { name: "Add Customer" }));

    expect(mutate).toHaveBeenCalled();
    const [, options] = mutate.mock.calls[0];
    options.onSuccess();
    expect(onClose).toHaveBeenCalled();
  });
});
