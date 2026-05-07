import {
  createCustomer,
  deleteCustomer,
  fetchCustomers,
  updateCustomer,
} from "@/lib/api/customers";

describe("lib/api/customers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  it("fetchCustomers throws on 429", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ status: 429, ok: false });

    await expect(fetchCustomers({ search: "", page: 1, sortBy: "newest" })).rejects.toThrow(
      "Too many requests. Please slow down."
    );
  });

  it("fetchCustomers returns payload on success", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({ customers: [], total: 0, page: 1, totalPages: 0 }),
    });

    const result = await fetchCustomers({ search: "", page: 1, sortBy: "newest" });
    expect(result.total).toBe(0);
  });

  it("createCustomer sends POST request", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "1" }),
    });

    await createCustomer({
      name: "Jane",
      email: "jane@example.com",
      phone: "1234567",
      company: "ACME",
      country: "India",
      status: "Active",
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/customers",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("updateCustomer sends PUT request", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "1" }),
    });
    await updateCustomer("1", { name: "Updated" });
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/customers/1",
      expect.objectContaining({ method: "PUT" })
    );
  });

  it("deleteCustomer sends DELETE request", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    await deleteCustomer("1");
    expect(global.fetch).toHaveBeenCalledWith("/api/customers/1", { method: "DELETE" });
  });
});
