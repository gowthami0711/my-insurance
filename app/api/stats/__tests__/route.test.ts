jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@/lib/withRateLimit", () => ({
  withRateLimit: jest.fn(),
}));

jest.mock("@/lib/db", () => ({
  db: {
    customer: {
      count: jest.fn(),
    },
  },
}));

import { auth } from "@/auth";
import { withRateLimit } from "@/lib/withRateLimit";
import { db } from "@/lib/db";
import { GET } from "@/app/api/stats/route";

describe("stats route", () => {
  const authMock = auth as jest.Mock;
  const rateLimitMock = withRateLimit as jest.Mock;
  const countMock = db.customer.count as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    rateLimitMock.mockResolvedValue(null);
  });

  it("returns 401 when unauthenticated", async () => {
    authMock.mockResolvedValueOnce(null);
    const response = await GET({} as never);
    expect(response.status).toBe(401);
  });

  it("returns aggregated stats", async () => {
    authMock.mockResolvedValueOnce({ user: { role: "admin" } });
    countMock
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(7)
      .mockResolvedValueOnce(7)
      .mockResolvedValueOnce(3);

    const response = await GET({} as never);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      totalCustomers: 10,
      members: 7,
      activeNow: 7,
      inactive: 3,
    });
  });
});
