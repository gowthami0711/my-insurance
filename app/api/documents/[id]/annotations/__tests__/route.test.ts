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
    annotation: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import { auth } from "@/auth";
import { withRateLimit } from "@/lib/withRateLimit";
import { db } from "@/lib/db";
import { GET, POST } from "@/app/api/documents/[id]/annotations/route";

describe("documents/[id]/annotations route", () => {
  const authMock = auth as jest.Mock;
  const rateLimitMock = withRateLimit as jest.Mock;
  const findManyMock = db.annotation.findMany as jest.Mock;
  const createMock = db.annotation.create as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    rateLimitMock.mockResolvedValue(null);
  });

  it("GET returns annotations for document", async () => {
    authMock.mockResolvedValueOnce({ user: { role: "admin" } });
    findManyMock.mockResolvedValueOnce([{ id: "a1" }]);

    const response = await GET({} as never, { params: Promise.resolve({ id: "d1" }) });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual([{ id: "a1" }]);
  });

  it("POST rejects invalid payload", async () => {
    authMock.mockResolvedValueOnce({ user: { role: "admin" } });

    const response = await POST(
      { json: async () => ({}) } as never,
      { params: Promise.resolve({ id: "d1" }) }
    );
    expect(response.status).toBe(400);
  });

  it("POST creates annotation", async () => {
    authMock.mockResolvedValueOnce({ user: { role: "admin" } });
    createMock.mockResolvedValueOnce({ id: "a1" });

    const response = await POST(
      {
        json: async () => ({
          page: 1,
          x: 10,
          y: 20,
          width: 30,
          height: 40,
          color: "#ff0",
          author: "agent",
        }),
      } as never,
      { params: Promise.resolve({ id: "d1" }) }
    );

    expect(response.status).toBe(201);
    expect(createMock).toHaveBeenCalled();
  });
});
