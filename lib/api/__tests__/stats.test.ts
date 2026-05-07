import { fetchStats } from "@/lib/api/stats";

describe("lib/api/stats", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  it("throws when request fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    await expect(fetchStats()).rejects.toThrow("Failed to fetch stats");
  });

  it("returns stats payload on success", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ totalCustomers: 5, members: 4, activeNow: 4, inactive: 1 }),
    });

    const result = await fetchStats();
    expect(result.totalCustomers).toBe(5);
  });
});
