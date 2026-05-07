jest.mock("@upstash/redis", () => ({
  Redis: jest.fn(),
}));

jest.mock("@upstash/ratelimit", () => ({
  Ratelimit: Object.assign(jest.fn(), {
    slidingWindow: jest.fn(),
  }),
}));

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { checkRateLimit } from "@/lib/rateLimit";

describe("checkRateLimit", () => {
  const originalEnv = process.env;
  const limitMock = jest.fn();
  const slidingWindowMock = Ratelimit.slidingWindow as jest.Mock;
  const redisCtorMock = Redis as unknown as jest.Mock;
  const ratelimitCtorMock = Ratelimit as unknown as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    slidingWindowMock.mockReturnValue("window");
    redisCtorMock.mockImplementation(() => ({}));
    ratelimitCtorMock.mockImplementation(() => ({
      limit: limitMock,
    }));
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("allows request when Upstash env vars are missing", async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    const result = await checkRateLimit("api", "127.0.0.1");

    expect(result.success).toBe(true);
    expect(result.limit).toBe(Number.POSITIVE_INFINITY);
    expect(redisCtorMock).not.toHaveBeenCalled();
    expect(ratelimitCtorMock).not.toHaveBeenCalled();
  });

  it("uses configured limiter when Upstash env vars are present", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "token";

    limitMock.mockResolvedValueOnce({
      success: true,
      limit: 60,
      remaining: 59,
      reset: 1_000_000,
    });

    const result = await checkRateLimit("api", "127.0.0.1");

    expect(redisCtorMock).toHaveBeenCalledWith({
      url: "https://example.upstash.io",
      token: "token",
    });
    expect(slidingWindowMock).toHaveBeenCalledWith(60, "1 m");
    expect(result).toEqual({
      success: true,
      limit: 60,
      remaining: 59,
      reset: 1_000_000,
    });
  });
});
