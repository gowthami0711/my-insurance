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

jest.mock("@/lib/s3", () => ({
  getUploadUrl: jest.fn(),
}));

jest.mock("crypto", () => ({
  randomUUID: () => "uuid-1",
}));

jest.mock("@/lib/db", () => ({
  db: {
    document: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import { auth } from "@/auth";
import { withRateLimit } from "@/lib/withRateLimit";
import { getUploadUrl } from "@/lib/s3";
import { db } from "@/lib/db";
import { GET, POST } from "@/app/api/documents/route";

describe("documents route", () => {
  const authMock = auth as jest.Mock;
  const rateLimitMock = withRateLimit as jest.Mock;
  const getUploadUrlMock = getUploadUrl as jest.Mock;
  const findManyMock = db.document.findMany as jest.Mock;
  const createMock = db.document.create as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    rateLimitMock.mockResolvedValue(null);
  });

  it("GET returns 400 when customerId is missing", async () => {
    authMock.mockResolvedValueOnce({ user: { role: "admin" } });
    const request = { nextUrl: { searchParams: new URLSearchParams() } } as never;

    const response = await GET(request);
    expect(response.status).toBe(400);
  });

  it("GET returns document list", async () => {
    authMock.mockResolvedValueOnce({ user: { role: "admin" } });
    findManyMock.mockResolvedValueOnce([{ id: "d1" }]);
    const request = {
      nextUrl: { searchParams: new URLSearchParams("customerId=c1") },
    } as never;

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(findManyMock).toHaveBeenCalled();
    expect(body).toEqual([{ id: "d1" }]);
  });

  it("POST rejects invalid payload", async () => {
    authMock.mockResolvedValueOnce({ user: { role: "admin" } });
    const request = { json: async () => ({}) } as never;

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("POST creates a document and upload URL", async () => {
    process.env.AWS_S3_BUCKET = "bucket";
    process.env.AWS_REGION = "ap-south-1";
    authMock.mockResolvedValueOnce({ user: { role: "admin" } });
    getUploadUrlMock.mockResolvedValueOnce("https://upload-url");
    createMock.mockResolvedValueOnce({ id: "d1", key: "documents/c1/uuid-1-file.pdf" });

    const request = {
      json: async () => ({
        fileName: "file.pdf",
        fileType: "application/pdf",
        fileSize: 1234,
        customerId: "c1",
        pages: 2,
      }),
    } as never;

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(getUploadUrlMock).toHaveBeenCalled();
    expect(createMock).toHaveBeenCalled();
    expect(body.uploadUrl).toBe("https://upload-url");
  });
});
