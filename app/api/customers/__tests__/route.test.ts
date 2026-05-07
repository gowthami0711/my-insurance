const authMock = jest.fn();
const withRateLimitMock = jest.fn();
const findManyMock = jest.fn();
const countMock = jest.fn();
const createMock = jest.fn();

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

jest.mock("@/auth", () => ({
  auth: () => authMock(),
}));

jest.mock("@/lib/withRateLimit", () => ({
  withRateLimit: (...args: unknown[]) => withRateLimitMock(...args),
}));

jest.mock("@/lib/db", () => ({
  db: {
    customer: {
      findMany: (...args: unknown[]) => findManyMock(...args),
      count: (...args: unknown[]) => countMock(...args),
      create: (...args: unknown[]) => createMock(...args),
    },
  },
}));

import { GET, POST } from "@/app/api/customers/route";

describe("customers route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    withRateLimitMock.mockResolvedValue(null);
  });

  it("GET returns 401 when unauthenticated", async () => {
    authMock.mockResolvedValueOnce(null);
    const request = { url: "http://localhost/api/customers" } as never;

    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it("GET returns paginated customers", async () => {
    authMock.mockResolvedValueOnce({ user: { role: "admin" } });
    findManyMock.mockResolvedValueOnce([{ id: "1", name: "Jane" }]);
    countMock.mockResolvedValueOnce(1);
    const request = {
      url: "http://localhost/api/customers?search=jane&page=1&sortBy=name",
    } as never;

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(findManyMock).toHaveBeenCalled();
    expect(countMock).toHaveBeenCalled();
    expect(body.totalPages).toBe(1);
  });

  it("POST rejects viewer role", async () => {
    authMock.mockResolvedValueOnce({ user: { role: "viewer" } });
    const request = {
      json: async () => ({}),
    } as never;

    const response = await POST(request);
    expect(response.status).toBe(403);
  });

  it("POST creates customer for valid payload", async () => {
    authMock.mockResolvedValueOnce({ user: { role: "admin" } });
    createMock.mockResolvedValueOnce({ id: "1", name: "Jane" });
    const request = {
      json: async () => ({
        name: "Jane",
        email: "jane@example.com",
        phone: "1234567",
        company: "ACME",
        country: "India",
        status: "Active",
      }),
    } as never;

    const response = await POST(request);
    expect(response.status).toBe(201);
    expect(createMock).toHaveBeenCalled();
  });
});
