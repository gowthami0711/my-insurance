const useMutationMock = jest.fn();
const useQueryClientMock = jest.fn();
const createCustomerMock = jest.fn();
const updateCustomerMock = jest.fn();
const deleteCustomerMock = jest.fn();

jest.mock("@tanstack/react-query", () => ({
  useMutation: (...args: unknown[]) => useMutationMock(...args),
  useQueryClient: () => useQueryClientMock(),
}));

jest.mock("@/lib/api/customers", () => ({
  createCustomer: (...args: unknown[]) => createCustomerMock(...args),
  updateCustomer: (...args: unknown[]) => updateCustomerMock(...args),
  deleteCustomer: (...args: unknown[]) => deleteCustomerMock(...args),
}));

import {
  useCreateCustomer,
  useDeleteCustomer,
  useUpdateCustomer,
} from "@/hooks/useCustomerMutation";

describe("useCustomerMutation hooks", () => {
  const invalidateQueriesMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useMutationMock.mockImplementation((config: unknown) => config);
    useQueryClientMock.mockReturnValue({
      invalidateQueries: invalidateQueriesMock,
    });
  });

  it("useCreateCustomer invalidates customers and stats on success", async () => {
    const mutation = useCreateCustomer() as { mutationFn: (data: unknown) => Promise<unknown>; onSuccess: () => void };

    await mutation.mutationFn({ name: "a" });
    mutation.onSuccess();

    expect(createCustomerMock).toHaveBeenCalled();
    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: ["customers"] });
    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: ["stats"] });
  });

  it("useUpdateCustomer calls update API and invalidates customers", async () => {
    const mutation = useUpdateCustomer() as {
      mutationFn: (data: { id: string; data: unknown }) => Promise<unknown>;
      onSuccess: () => void;
    };

    await mutation.mutationFn({ id: "1", data: { name: "b" } });
    mutation.onSuccess();

    expect(updateCustomerMock).toHaveBeenCalledWith("1", { name: "b" });
    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: ["customers"] });
  });

  it("useDeleteCustomer calls delete API and invalidates customers and stats", async () => {
    const mutation = useDeleteCustomer() as { mutationFn: (id: string) => Promise<unknown>; onSuccess: () => void };

    await mutation.mutationFn("1");
    mutation.onSuccess();

    expect(deleteCustomerMock).toHaveBeenCalledWith("1");
    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: ["customers"] });
    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: ["stats"] });
  });
});
