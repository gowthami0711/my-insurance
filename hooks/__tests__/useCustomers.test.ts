const useQueryMock = jest.fn();
const useCustomersStoreMock = jest.fn();
const fetchCustomersMock = jest.fn();

jest.mock("@tanstack/react-query", () => ({
  useQuery: (...args: unknown[]) => useQueryMock(...args),
}));

jest.mock("@/store/customers.store", () => ({
  useCustomersStore: () => useCustomersStoreMock(),
}));

jest.mock("@/lib/api/customers", () => ({
  fetchCustomers: (...args: unknown[]) => fetchCustomersMock(...args),
}));

import { useCustomers } from "@/hooks/useCustomers";

describe("useCustomers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCustomersStoreMock.mockReturnValue({
      search: "john",
      page: 2,
      sortBy: "name",
    });
    useQueryMock.mockReturnValue({ data: null });
  });

  it("calls useQuery with store-driven query config", async () => {
    useCustomers();

    const config = useQueryMock.mock.calls[0][0];
    expect(config.queryKey).toEqual(["customers", { search: "john", page: 2, sortBy: "name" }]);

    await config.queryFn();
    expect(fetchCustomersMock).toHaveBeenCalledWith({
      search: "john",
      page: 2,
      sortBy: "name",
    });
  });
});
