import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to initialize Prisma client");
  }

  const adapter = new PrismaNeon({
    connectionString: databaseUrl,
  });
  return new PrismaClient({ adapter });
}

function getPrismaClient() {
  if (globalThis.prisma) return globalThis.prisma;

  const client = createPrismaClient();
  if (process.env.NODE_ENV !== "production") globalThis.prisma = client;
  return client;
}

export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});