import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  try {
    const pool = new Pool({
      connectionString: url,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  } catch {
    return null;
  }
}

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const client = createPrismaClient();
    if (!client) {
      throw new Error("DATABASE_URL is not set");
    }
    globalForPrisma.prisma = client;
  }
  return globalForPrisma.prisma;
}

// Lazy proxy — only connects when a query is actually made
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, _receiver) {
    if (prop === Symbol.toPrimitive) return () => "[PrismaClient]";
    if (prop === "then") return undefined;
    const client = getClient();
    const val = Reflect.get(client, prop, client);
    if (typeof val === "function") {
      return val.bind(client);
    }
    return val;
  },
});

if (process.env.NODE_ENV !== "production" && process.env.DATABASE_URL) {
  globalForPrisma.prisma = createPrismaClient()!;
}

export default prisma;
