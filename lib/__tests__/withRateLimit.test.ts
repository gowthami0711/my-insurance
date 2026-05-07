const checkRateLimitMock = jest.fn();

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number; headers?: Record<string, string> }) => ({
      status: init?.status ?? 200,
      headers: init?.headers ?? {},
      json: async () => body,
    }),
  },
}));

jest.mock("@/lib/rateLimit", () => ({
  checkRateLimit: (...args: unknown[]) => checkRateLimitMock(...args),
}));

import { withRateLimit } from "@/lib/withRateLimit";

describe("withRateLimit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when limit check succeeds", async () => {
    checkRateLimitMock.mockResolvedValueOnce({
      success: true,
      limit: 60,
      remaining: 50,
      reset: Date.now() + 60_000,
    });

    const request = {
      headers: {
        get: (name: string) => (name === "x-real-ip" ? "10.0.0.1" : null),
      },
    } as never;

    const result = await withRateLimit(request, "api");

    expect(checkRateLimitMock).toHaveBeenCalledWith("api", "10.0.0.1");
    expect(result).toBeNull();
  });

  it("returns 429 response when limit check fails", async () => {
    const reset = Date.now() + 10_000;
    checkRateLimitMock.mockResolvedValueOnce({
      success: false,
      limit: 60,
      remaining: 0,
      reset,
    });

    const request = {
      headers: {
        get: () => null,
      },
    } as never;

    const result = await withRateLimit(request, "api");

    expect(checkRateLimitMock).toHaveBeenCalledWith("api", "anonymous");
    expect(result?.status).toBe(429);

    const body = await result?.json();
    expect(body?.error).toBe("Too many requests");
  });
});
