describe("prisma seedUsers script", () => {
  async function waitFor(condition: () => boolean, attempts = 40) {
    for (let i = 0; i < attempts; i += 1) {
      if (condition()) return;
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    throw new Error("Timed out waiting for condition");
  }

  it("hashes user passwords, upserts users, and disconnects", async () => {
    const upsertMock = jest.fn().mockResolvedValue({});
    const disconnectMock = jest.fn().mockResolvedValue(undefined);
    const prismaClientCtorMock = jest.fn().mockImplementation(() => ({
      user: { upsert: upsertMock },
      $disconnect: disconnectMock,
    }));
    const prismaNeonCtorMock = jest.fn();
    const hashMock = jest.fn().mockResolvedValue("hashed-password");
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

    jest.resetModules();
    jest.doMock("@prisma/client", () => ({ PrismaClient: prismaClientCtorMock }));
    jest.doMock("@prisma/adapter-neon", () => ({ PrismaNeon: prismaNeonCtorMock }));
    jest.doMock("bcryptjs", () => ({ __esModule: true, default: { hash: hashMock } }));
    jest.doMock("dotenv/config", () => ({}), { virtual: true });

    await import("../seedUsers");
    await waitFor(() => hashMock.mock.calls.length === 3);
    await waitFor(() => upsertMock.mock.calls.length === 3);
    await waitFor(() => disconnectMock.mock.calls.length === 1);

    expect(hashMock).toHaveBeenCalledTimes(3);
    expect(upsertMock).toHaveBeenCalledTimes(3);
    expect(upsertMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: { email: "admin@insurance.com" },
      })
    );
    expect(disconnectMock).toHaveBeenCalledTimes(1);

    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});
