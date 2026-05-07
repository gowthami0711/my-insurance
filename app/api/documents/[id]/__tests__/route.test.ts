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
  getViewUrl: jest.fn(),
  deleteObject: jest.fn(),
}));

jest.mock("@/lib/db", () => ({
  db: {
    document: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import { auth } from "@/auth";
import { withRateLimit } from "@/lib/withRateLimit";
import { getViewUrl, deleteObject } from "@/lib/s3";
import { db } from "@/lib/db";
import { DELETE, GET } from "@/app/api/documents/[id]/route";

describe("documents/[id] route", () => {
  const authMock = auth as jest.Mock;
  const rateLimitMock = withRateLimit as jest.Mock;
  const getViewUrlMock = getViewUrl as jest.Mock;
  const deleteObjectMock = deleteObject as jest.Mock;
  const findUniqueMock = db.document.findUnique as jest.Mock;
  const deleteMock = db.document.delete as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    rateLimitMock.mockResolvedValue(null);
  });

  it("GET returns 404 when document is missing", async () => {
    authMock.mockResolvedValueOnce({ user: { role: "admin" } });
    findUniqueMock.mockResolvedValueOnce(null);

    const response = await GET({} as never, { params: Promise.resolve({ id: "d1" }) });
    expect(response.status).toBe(404);
  });

  it("GET returns document with view URL", async () => {
    authMock.mockResolvedValueOnce({ user: { role: "admin" } });
    findUniqueMock.mockResolvedValueOnce({ id: "d1", key: "k1" });
    getViewUrlMock.mockResolvedValueOnce("https://view-url");

    const response = await GET({} as never, { params: Promise.resolve({ id: "d1" }) });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.viewUrl).toBe("https://view-url");
  });

  it("DELETE requires admin", async () => {
    authMock.mockResolvedValueOnce({ user: { role: "viewer" } });

    const response = await DELETE({} as never, { params: Promise.resolve({ id: "d1" }) });
    expect(response.status).toBe(403);
  });

  it("DELETE removes s3 object and db row", async () => {
    authMock.mockResolvedValueOnce({ user: { role: "admin" } });
    findUniqueMock.mockResolvedValueOnce({ id: "d1", key: "k1" });
    deleteMock.mockResolvedValueOnce({});
    deleteObjectMock.mockResolvedValueOnce(undefined);

    const response = await DELETE({} as never, { params: Promise.resolve({ id: "d1" }) });
    expect(response.status).toBe(200);
    expect(deleteObjectMock).toHaveBeenCalledWith("k1");
    expect(deleteMock).toHaveBeenCalledWith({ where: { id: "d1" } });
  });
});
