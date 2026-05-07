describe("prisma seed script", () => {
  async function waitFor(condition: () => boolean, attempts = 30) {
    for (let i = 0; i < attempts; i += 1) {
      if (condition()) return;
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    throw new Error("Timed out waiting for condition");
  }

  it("seeds customers with createMany and disconnects", async () => {
    const createManyMock = jest.fn().mockResolvedValue({});
    const disconnectMock = jest.fn().mockResolvedValue(undefined);
    const prismaClientCtorMock = jest.fn().mockImplementation(() => ({
      customer: { createMany: createManyMock },
      $disconnect: disconnectMock,
    }));
    const prismaNeonCtorMock = jest.fn();
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

    jest.resetModules();
    jest.doMock("@prisma/client", () => ({ PrismaClient: prismaClientCtorMock }));
    jest.doMock("@prisma/adapter-neon", () => ({ PrismaNeon: prismaNeonCtorMock }));
    jest.doMock("dotenv/config", () => ({}), { virtual: true });

    await import("../seed");
    await waitFor(() => createManyMock.mock.calls.length === 1);
    await waitFor(() => disconnectMock.mock.calls.length === 1);

    expect(prismaClientCtorMock).toHaveBeenCalledTimes(1);
    expect(createManyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.any(Array),
        skipDuplicates: true,
      })
    );

    const payload = createManyMock.mock.calls[0][0] as { data: unknown[] };
    expect(payload.data.length).toBeGreaterThan(100);
    expect(disconnectMock).toHaveBeenCalledTimes(1);

    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});
