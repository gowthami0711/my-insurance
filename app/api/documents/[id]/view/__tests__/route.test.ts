jest.mock("next/server", () => {
  class MockNextResponse {
    status: number;
    headers: Record<string, string>;
    body: unknown;

    constructor(body: unknown, init?: { status?: number; headers?: Record<string, string> }) {
      this.body = body;
      this.status = init?.status ?? 200;
      this.headers = init?.headers ?? {};
    }

    static json(body: unknown, init?: { status?: number }) {
      return {
        status: init?.status ?? 200,
        json: async () => body,
      };
    }
  }

  return { NextResponse: MockNextResponse };
});

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@/lib/withRateLimit", () => ({
  withRateLimit: jest.fn(),
}));

jest.mock("@/lib/s3", () => ({
  getViewUrl: jest.fn(),
}));

jest.mock("@/lib/db", () => ({
  db: {
    document: {
      findUnique: jest.fn(),
    },
  },
}));

import { auth } from "@/auth";
import { withRateLimit } from "@/lib/withRateLimit";
import { getViewUrl } from "@/lib/s3";
import { db } from "@/lib/db";
import { GET } from "@/app/api/documents/[id]/view/route";

describe("documents/[id]/view route", () => {
  const authMock = auth as jest.Mock;
  const rateLimitMock = withRateLimit as jest.Mock;
  const getViewUrlMock = getViewUrl as jest.Mock;
  const findUniqueMock = db.document.findUnique as jest.Mock;
  beforeEach(() => {
    jest.clearAllMocks();
    rateLimitMock.mockResolvedValue(null);
    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  it("returns 404 when document is missing", async () => {
    authMock.mockResolvedValueOnce({ user: { role: "admin" } });
    findUniqueMock.mockResolvedValueOnce(null);

    const response = await GET(
      { nextUrl: { searchParams: new URLSearchParams("page=1") } } as never,
      { params: Promise.resolve({ id: "d1" }) }
    );

    expect(response.status).toBe(404);
  });

  it("returns partial pdf response with range headers", async () => {
    authMock.mockResolvedValueOnce({ user: { role: "admin" } });
    findUniqueMock.mockResolvedValueOnce({ id: "d1", key: "key-1" });
    getViewUrlMock.mockResolvedValueOnce("https://signed");
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      body: "pdf-stream",
      headers: {
        get: (name: string) => (name === "Content-Range" ? "bytes 0-10/100" : null),
      },
    });

    const response = (await GET(
      { nextUrl: { searchParams: new URLSearchParams("page=1") } } as never,
      { params: Promise.resolve({ id: "d1" }) }
    )) as unknown as { status: number; headers: Record<string, string> };

    expect(global.fetch).toHaveBeenCalledWith("https://signed", {
      headers: { Range: "bytes=0-511999" },
    });
    expect(response.status).toBe(206);
    expect(response.headers["Content-Type"]).toBe("application/pdf");
  });
});
