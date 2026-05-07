const authMock = jest.fn();
const withRateLimitMock = jest.fn();
const updateMock = jest.fn();
const deleteMock = jest.fn();

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
      update: (...args: unknown[]) => updateMock(...args),
      delete: (...args: unknown[]) => deleteMock(...args),
    },
  },
}));

import { DELETE, PUT } from "@/app/api/customers/[id]/route";

describe("customers/[id] route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    withRateLimitMock.mockResolvedValue(null);
  });

  it("PUT returns 400 for invalid payload", async () => {
    authMock.mockResolvedValueOnce({ user: { role: "admin" } });
    const request = {
      json: async () => ({ email: "invalid" }),
    } as never;
    const params = Promise.resolve({ id: "cus_1" });

    const response = await PUT(request, { params });
    expect(response.status).toBe(400);
  });

  it("PUT updates customer for valid payload", async () => {
    authMock.mockResolvedValueOnce({ user: { role: "admin" } });
    updateMock.mockResolvedValueOnce({ id: "cus_1", name: "Jane" });
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
    const params = Promise.resolve({ id: "cus_1" });

    const response = await PUT(request, { params });
    expect(response.status).toBe(200);
    expect(updateMock).toHaveBeenCalled();
  });

  it("DELETE requires admin role", async () => {
    authMock.mockResolvedValueOnce({ user: { role: "editor" } });
    const request = {} as never;
    const params = Promise.resolve({ id: "cus_1" });

    const response = await DELETE(request, { params });
    expect(response.status).toBe(403);
  });

  it("DELETE removes customer for admin", async () => {
    authMock.mockResolvedValueOnce({ user: { role: "admin" } });
    deleteMock.mockResolvedValueOnce({});
    const request = {} as never;
    const params = Promise.resolve({ id: "cus_1" });

    const response = await DELETE(request, { params });
    expect(response.status).toBe(200);
    expect(deleteMock).toHaveBeenCalledWith({ where: { id: "cus_1" } });
  });
});
