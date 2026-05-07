const prismaClientCtorMock = jest.fn();
const prismaNeonCtorMock = jest.fn();

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation((config: unknown) => {
    prismaClientCtorMock(config);
    return {
      $connect: jest.fn(),
    };
  }),
}));

jest.mock("@prisma/adapter-neon", () => ({
  PrismaNeon: jest.fn().mockImplementation((config: unknown) => {
    prismaNeonCtorMock(config);
    return {};
  }),
}));

describe("db proxy", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.DATABASE_URL;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("throws helpful error when DATABASE_URL is missing", async () => {
    const { db } = await import("@/lib/db");
    expect(() => {
      void db.$connect;
    }).toThrow("DATABASE_URL is required to initialize Prisma client");
  });

  it("creates prisma client when DATABASE_URL is provided", async () => {
    process.env.DATABASE_URL = "postgres://user:pass@localhost:5432/db";
    const { db } = await import("@/lib/db");

    void db.$connect;

    expect(prismaNeonCtorMock).toHaveBeenCalledWith({
      connectionString: "postgres://user:pass@localhost:5432/db",
    });
    expect(prismaClientCtorMock).toHaveBeenCalledTimes(1);
  });
});
