import config from "@/prisma/prisma.config";

describe("prisma.config", () => {
  it("uses expected schema and seed command", () => {
    expect(config.schema).toBe("prisma/schema.prisma");
    expect(config.migrations.seed).toBe("tsx prisma/seed.ts");
  });

  it("wires datasource url from env", () => {
    expect(config.datasource.url).toBe(process.env.DATABASE_URL);
  });
});
