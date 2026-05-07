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
    comment: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import { auth } from "@/auth";
import { withRateLimit } from "@/lib/withRateLimit";
import { db } from "@/lib/db";
import { GET, POST } from "@/app/api/documents/[id]/comments/route";

describe("documents/[id]/comments route", () => {
  const authMock = auth as jest.Mock;
  const rateLimitMock = withRateLimit as jest.Mock;
  const findManyMock = db.comment.findMany as jest.Mock;
  const createMock = db.comment.create as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    rateLimitMock.mockResolvedValue(null);
  });

  it("GET returns comments for document", async () => {
    authMock.mockResolvedValueOnce({ user: { role: "admin" } });
    findManyMock.mockResolvedValueOnce([{ id: "c1" }]);

    const response = await GET({} as never, { params: Promise.resolve({ id: "d1" }) });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual([{ id: "c1" }]);
  });

  it("POST rejects viewer role", async () => {
    authMock.mockResolvedValueOnce({ user: { role: "viewer" } });

    const response = await POST(
      { json: async () => ({ content: "hello", page: 1, author: "a" }) } as never,
      { params: Promise.resolve({ id: "d1" }) }
    );
    expect(response.status).toBe(403);
  });

  it("POST creates comment", async () => {
    authMock.mockResolvedValueOnce({ user: { role: "admin" } });
    createMock.mockResolvedValueOnce({ id: "c1" });

    const response = await POST(
      { json: async () => ({ content: "hello", page: 1, author: "a" }) } as never,
      { params: Promise.resolve({ id: "d1" }) }
    );

    expect(response.status).toBe(201);
    expect(createMock).toHaveBeenCalledWith({
      data: { documentId: "d1", content: "hello", page: 1, author: "a" },
    });
  });
});
