const useQueryMock = jest.fn();
const fetchStatsMock = jest.fn();

jest.mock("@tanstack/react-query", () => ({
  useQuery: (...args: unknown[]) => useQueryMock(...args),
}));

jest.mock("@/lib/api/stats", () => ({
  fetchStats: (...args: unknown[]) => fetchStatsMock(...args),
}));

import { useStats } from "@/hooks/useStats";

describe("useStats", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useQueryMock.mockReturnValue({ data: null });
  });

  it("configures stats query with expected key and stale time", async () => {
    useStats();

    const config = useQueryMock.mock.calls[0][0];
    expect(config.queryKey).toEqual(["stats"]);
    expect(config.staleTime).toBe(30_000);

    await config.queryFn();
    expect(fetchStatsMock).toHaveBeenCalled();
  });
});
